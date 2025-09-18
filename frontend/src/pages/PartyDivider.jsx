import { useState } from "react";
import Navbar from "../components/Navbar";
import "./PartyDivider.css";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function darkenColor(hex, percent) {
  let r = parseInt(hex.slice(1,3),16);
  let g = parseInt(hex.slice(3,5),16);
  let b = parseInt(hex.slice(5,7),16);
  r = Math.floor(r * (1 - percent));
  g = Math.floor(g * (1 - percent));
  b = Math.floor(b * (1 - percent));
  return `rgb(${r},${g},${b})`;
}

const categoriasDefecto = [
  { nombre: "Comida", color: "#ffd54f" },
  { nombre: "Bebida", color: "#64b5f6" },
  { nombre: "Transporte", color: "#4dd0e1" },
  { nombre: "Entretenimiento", color: "#ba68c8" },
  { nombre: "Otros", color: "#b0bec5" }
];

export default function PartyDivider() {
  const [personas, setPersonas] = useState([]);
  const [nuevaPersona, setNuevaPersona] = useState("");
  const [gastos, setGastos] = useState([]);
  const [nuevoGasto, setNuevoGasto] = useState({
    nombre: "",
    valor: "",
    categoria: "",
    pagador: ""
  });
  const [editandoId, setEditandoId] = useState(null);
  const [editGasto, setEditGasto] = useState({});
  const [gastoAbiertoId, setGastoAbiertoId] = useState(null);

  // Agregar persona
  const agregarPersona = () => {
    if (nuevaPersona && !personas.includes(nuevaPersona)) {
      setPersonas([...personas, nuevaPersona]);
      setNuevaPersona("");
    }
  };

  // Agregar gasto
  const agregarGasto = () => {
    if (
      nuevoGasto.nombre &&
      nuevoGasto.valor &&
      nuevoGasto.categoria &&
      nuevoGasto.pagador
    ) {
      setGastos([
        ...gastos,
        {
          ...nuevoGasto,
          valor: parseFloat(nuevoGasto.valor),
          id: Date.now()
        }
      ]);
      setNuevoGasto({ nombre: "", valor: "", categoria: "", pagador: "" });
    }
  };

  // Editar gasto
  const empezarEdicion = (gasto) => {
    setEditandoId(gasto.id);
    setEditGasto({ ...gasto });
  };

  const guardarEdicion = () => {
    setGastos(
      gastos.map((g) =>
        g.id === editandoId ? { ...editGasto, valor: parseFloat(editGasto.valor) } : g
      )
    );
    setEditandoId(null);
    setEditGasto({});
  };

  const eliminarGasto = (id) => {
    setGastos(gastos.filter((g) => g.id !== id));
  };

  // Calcular totales por persona y por categoría
  const totalPorPersona = {};
  personas.forEach((p) => (totalPorPersona[p] = 0));
  gastos.forEach((g) => {
    totalPorPersona[g.pagador] += g.valor;
  });

  const totalPorCategoria = {};
  categoriasDefecto.forEach((c) => (totalPorCategoria[c.nombre] = 0));
  gastos.forEach((g) => {
    totalPorCategoria[g.categoria] += g.valor;
  });

  // Datos para gráfico de barras (categorías)
  const barData = {
    labels: categoriasDefecto.map((c) => c.nombre),
    datasets: [
      {
        label: "Total por categoría",
        data: categoriasDefecto.map((c) => totalPorCategoria[c.nombre]),
        backgroundColor: categoriasDefecto.map((c) => c.color),
        borderWidth: 1
      }
    ]
  };

  // Datos para gráfico donut (personas)
  const donutData = {
    labels: personas,
    datasets: [
      {
        data: personas.map((p) => totalPorPersona[p]),
        backgroundColor: personas.map(
          (_, i) => categoriasDefecto[i % categoriasDefecto.length].color
        ),
        hoverBackgroundColor: personas.map(
          (_, i) => darkenColor(categoriasDefecto[i % categoriasDefecto.length].color, 0.25)
        ),
        borderWidth: 2,
        borderColor: "#fff"
      }
    ]
  };

  // Calcular cuánto debería pagar cada uno (división equitativa)
  const totalGastos = gastos.reduce((sum, g) => sum + g.valor, 0);
  const porPersona = personas.length > 0 ? totalGastos / personas.length : 0;

  // Calcular balance de cada persona
  const balances = {};
  personas.forEach(p => {
    balances[p] = (totalPorPersona[p] || 0) - porPersona;
  });

  // Armar el resumen
  let resumen = "Resumen de balances:\n";
  personas.forEach(p => {
    if (balances[p] > 0) {
      resumen += `- ${p} recibe $${balances[p].toFixed(2)}\n`;
    } else if (balances[p] < 0) {
      resumen += `- ${p} debe $${Math.abs(balances[p]).toFixed(2)}\n`;
    } else {
      resumen += `- ${p} está saldado\n`;
    }
  });
  resumen += "\nGastos:\n";
  gastos.forEach(g => {
    resumen += `- ${g.nombre} ($${g.valor})\n`;
  });

  const enviarResumen = async () => {
    try {
      await fetch("/api/party/enviar-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ resumen }),
      });
      alert("Resumen enviado por email");
    } catch {
      alert("No se pudo enviar el email");
    }
  };

  return (
    <>
      <Navbar />
      <div className="party-container">
        <h2>Party Divider</h2>
        {/* Personas arriba */}
        <div className="party-personas">
          <h3>Personas</h3>
          <div className="party-personas-input-row">
            <input
              className="party-input"
              placeholder="Agregar persona"
              value={nuevaPersona}
              onChange={e => setNuevaPersona(e.target.value)}
              style={{ minWidth: 120 }}
            />
            <button className="party-btn-small" onClick={agregarPersona}>
              Agregar
            </button>
          </div>
          <div className="party-personas-list">
            {personas.map((p) => (
              <div key={p} className="party-persona">{p}</div>
            ))}
          </div>
        </div>
        {/* Listado de gastos debajo */}
        <div className="party-listado">
          <div className="party-listado-header">
            <span>Pagador</span>
            <span>Nombre</span>
            <span>Categoría</span>
            <span>Valor</span>
            <span>Acciones</span>
          </div>
          <ul>
            {gastos.map((gasto) => {
              const abierto = gastoAbiertoId === gasto.id;
              return (
                <li
                  key={gasto.id}
                  className={`party-listado-row${abierto ? " abierto" : ""}`}
                  style={{
                    cursor: "pointer",
                    background: abierto ? "#353535" : undefined,
                    transition: "background 0.2s"
                  }}
                  onClick={() => setGastoAbiertoId(abierto ? null : gasto.id)}
                >
                  {editandoId === gasto.id ? (
                    <>
                      <span>
                        <select
                          className="party-form-select"
                          value={editGasto.pagador}
                          onChange={e =>
                            setEditGasto({ ...editGasto, pagador: e.target.value })
                          }
                        >
                          <option value="">-- Pagador --</option>
                          {personas.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </span>
                      <span>
                        <input
                          className="party-form-input"
                          value={editGasto.nombre}
                          onChange={e =>
                            setEditGasto({ ...editGasto, nombre: e.target.value })
                          }
                          placeholder="Nombre"
                        />
                      </span>
                      <span>
                        <select
                          className="party-form-select"
                          value={editGasto.categoria}
                          onChange={e =>
                            setEditGasto({ ...editGasto, categoria: e.target.value })
                          }
                        >
                          <option value="">-- Categoría --</option>
                          {categoriasDefecto.map((c) => (
                            <option key={c.nombre} value={c.nombre}>
                              {c.nombre}
                            </option>
                          ))}
                        </select>
                      </span>
                      <span>
                        <input
                          className="party-form-input"
                          value={editGasto.valor}
                          onChange={e =>
                            setEditGasto({ ...editGasto, valor: e.target.value })
                          }
                          placeholder="Valor"
                          type="number"
                        />
                      </span>
                      <span>
                        <button
                          className="party-btn-small party-form-guardar"
                          onClick={guardarEdicion}
                        >
                          Guardar
                        </button>
                        <button
                          className="party-btn-small party-form-cancel"
                          onClick={() => setEditandoId(null)}
                        >
                          Cancelar
                        </button>
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{gasto.pagador}</span>
                      <span>{gasto.nombre}</span>
                      <span>
                        {gasto.categoria}
                        <span
                          style={{
                            display: "inline-block",
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background:
                              categoriasDefecto.find(c => c.nombre === gasto.categoria)?.color ||
                              "#888",
                            border: "1.5px solid #fff",
                            marginLeft: 6
                          }}
                          title={gasto.categoria}
                        />
                      </span>
                      <span>${gasto.valor}</span>
                      <span>
                        {abierto && (
                          <>
                            <button
                              className="party-btn-small"
                              onClick={e => {
                                e.stopPropagation();
                                empezarEdicion(gasto);
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              className="party-btn-small"
                              onClick={e => {
                                e.stopPropagation();
                                eliminarGasto(gasto.id);
                              }}
                            >
                              ❌
                            </button>
                          </>
                        )}
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          <form
            className="party-listado-row"
            style={{ marginTop: 8 }}
            onSubmit={e => {
              e.preventDefault();
              agregarGasto();
            }}
          >
            <span>
              <select
                className="party-form-select"
                value={nuevoGasto.pagador}
                onChange={e =>
                  setNuevoGasto({ ...nuevoGasto, pagador: e.target.value })
                }
              >
                <option value="">-- Pagador --</option>
                {personas.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </span>
            <span>
              <input
                className="party-form-input"
                placeholder="Nombre del gasto"
                value={nuevoGasto.nombre}
                onChange={e =>
                  setNuevoGasto({ ...nuevoGasto, nombre: e.target.value })
                }
              />
            </span>
            <span>
              <select
                className="party-form-select"
                value={nuevoGasto.categoria}
                onChange={e =>
                  setNuevoGasto({ ...nuevoGasto, categoria: e.target.value })
                }
              >
                <option value="">-- Categoría --</option>
                {categoriasDefecto.map((c) => (
                  <option key={c.nombre} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </span>
            <span>
              <input
                className="party-form-input"
                placeholder="Valor"
                type="number"
                value={nuevoGasto.valor}
                onChange={e =>
                  setNuevoGasto({ ...nuevoGasto, valor: e.target.value })
                }
              />
            </span>
            <span>
              <button className="party-btn-small" type="submit">
                Agregar
              </button>
            </span>
          </form>
        </div>
        {/* Donut: gasto por persona */}
        <div className="party-chart-container">
          <div className="party-chart-title">Gasto por persona</div>
          <div className="party-chart-content">
            <Doughnut
              data={donutData}
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    bodyFont: { size: 16 },
                    callbacks: {
                      label: function(context) {
                        return `${context.label}: $${context.parsed}`;
                      }
                    }
                  }
                }
              }}
              style={{ maxHeight: 220 }}
            />
            <div className="party-chart-legend">
              {personas.map((p, i) => (
                <div key={p} className="party-chart-legend-item">
                  <span
                    className="party-chart-legend-color"
                    style={{
                      background:
                        categoriasDefecto[i % categoriasDefecto.length].color
                    }}
                  />
                  <span className="party-chart-legend-label">{p}</span>
                  <span className="party-chart-legend-total">
                    ${totalPorPersona[p]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Barra: gasto por categoría */}
        <div className="party-chart-container">
          <div className="party-chart-title">Gasto por categoría</div>
          <div className="party-chart-content">
            <Bar
              data={barData}
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    bodyFont: { size: 16 },
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: $${context.parsed.y}`;
                      }
                    }
                  }
                },
                scales: {
                  x: { ticks: { color: "#fff", font: { size: 14 } } },
                  y: { ticks: { color: "#fff", font: { size: 14 } }, beginAtZero: true }
                }
              }}
              style={{ maxHeight: 220 }}
            />
            <div className="party-chart-legend">
              {categoriasDefecto.map((tipo) => (
                <div key={tipo.nombre} className="party-chart-legend-item">
                  <span
                    className="party-chart-legend-color"
                    style={{ background: tipo.color }}
                  />
                  <span className="party-chart-legend-label">{tipo.nombre}</span>
                  <span className="party-chart-legend-total">
                    ${totalPorCategoria[tipo.nombre]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          className="party-btn-small"
          style={{ margin: "1.5rem auto 0 auto", display: "block" }}
          onClick={enviarResumen}
        >
          Enviar resumen por email
        </button>
      </div>
    </>
  );
}