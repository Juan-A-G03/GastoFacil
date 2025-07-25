import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, Tooltip, CategoryScale, LinearScale } from "chart.js";
Chart.register(BarElement, Tooltip, CategoryScale, LinearScale);
import "./Historico.css"; // Usa tu CSS propio para histórico

export default function Historico() {
  const [historico, setHistorico] = useState({});
  const [mesSeleccionado, setMesSeleccionado] = useState(null);

  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const usuarioId = usuario?.id;

  useEffect(() => {
    axios.get(`/api/gastos/historico/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      console.log("Respuesta del backend:", res.data); // <-- Verifica la respuesta
      setHistorico(res.data);
    });
  }, []);

  const meses = Object.keys(historico)
    .filter(k => /^\d{4}-\d{2}$/.test(k))
    .sort()
    .reverse();

  console.log("Meses detectados:", meses); // <-- Verifica los meses

  function mesLegible(clave) {
    const [a, m] = clave.split("-");
    const nombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return `${nombres[parseInt(m, 10) - 1]} ${a}`;
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h2>Histórico de Gastos</h2>
        {meses.map(mes => {
          const gastosMes = historico[mes];
          console.log(`Gastos para ${mes}:`, gastosMes); // <-- Verifica los gastos de cada mes
          const total = gastosMes.reduce((s, g) => s + g.valor, 0);
          const categorias = [...new Set(gastosMes.map(g => g.tipo?.nombre))];
          const colores = categorias.map(cat =>
            gastosMes.find(g => g.tipo?.nombre === cat)?.tipo?.color || "#888"
          );
          const valores = categorias.map(cat =>
            gastosMes
              .filter(g => g.tipo?.nombre === cat)
              .reduce((sum, g) => sum + g.valor, 0)
          );

          const estaAbierto = mesSeleccionado === mes;

          return (
            <div key={mes} className="historico-tarjeta">
              <div
                className="historico-tarjeta-header"
                onClick={() => setMesSeleccionado(mes === mesSeleccionado ? null : mes)}
              >
                <span role="img" aria-label="calendar">📅</span> {mesLegible(mes)} - <b>Total: ${total.toLocaleString()}</b>
                <span style={{ float: "right" }}>{estaAbierto ? "▲" : "▼"}</span>
              </div>

              {estaAbierto && (
                <div className="historico-tarjeta-body">
                  <div className="dashboard-listado-contenedor">
                    <div className="dashboard-listado-header">
                      <span>Nombre</span>
                      <span>Tipo</span>
                      <span>Valor</span>
                      <span>Fecha</span>
                    </div>
                    <ul>
                      {gastosMes.map(g => (
                        <li key={g.id} className="dashboard-listado-row">
                          <span>{g.nombre}</span>
                          <span>{g.tipo?.nombre}</span>
                          <span>${g.valor}</span>
                          <span>{new Date(g.fecha).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="historico-grafico-container">
                    <Bar
                      data={{
                        labels: categorias,
                        datasets: [{
                          label: "Total por categoría",
                          data: valores,
                          backgroundColor: colores,
                        }],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: ctx => `${ctx.label}: $${ctx.raw}`
                            }
                          }
                        },
                        scales: {
                          x: {
                            grid: { color: "#fff" },
                            ticks: { color: "#fff" }
                          },
                          y: {
                            beginAtZero: true,
                            grid: { color: "#fff" },
                            ticks: { color: "#fff" }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
