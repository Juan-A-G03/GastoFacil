import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from '../components/Navbar'; // ajustá el path si está en otra carpeta
import './Dashboard.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL;

function darkenColor(hex, percent) {
  // hex: "#RRGGBB", percent: 0.2 para oscurecer 20%
  let r = parseInt(hex.slice(1,3),16);
  let g = parseInt(hex.slice(3,5),16);
  let b = parseInt(hex.slice(5,7),16);
  r = Math.floor(r * (1 - percent));
  g = Math.floor(g * (1 - percent));
  b = Math.floor(b * (1 - percent));
  return `rgb(${r},${g},${b})`;
}

export default function Dashboard() {
  const [gastos, setGastos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevoTipoId, setNuevoTipoId] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editValor, setEditValor] = useState("");
  const [editTipoId, setEditTipoId] = useState("");
  const [gastoAbiertoId, setGastoAbiertoId] = useState(null);
  const chartRef = useRef();

  const mesActual = new Date().toLocaleString("es-ES", { month: "long" });

  const usuarioGuardado = localStorage.getItem("usuario");
  const usuarioId = usuarioGuardado && usuarioGuardado !== "undefined"
    ? JSON.parse(usuarioGuardado)?.id
    : null;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (usuarioId) {
      cargarTipos();
      cargarGastos();
    }
  }, [usuarioId]);

  const cargarGastos = async () => {
    const res = await axios.get(`${API_URL}/gastos/usuario/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setGastos(res.data);
  };

  const cargarTipos = async () => {
    const res = await axios.get(`${API_URL}/tipos?usuarioId=${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTipos(res.data);
  };

  const agregarGasto = async () => {
    if (!nuevoNombre || !nuevoPrecio || !nuevoTipoId) return;

    await axios.post(`${API_URL}/gastos`, {
      nombre: nuevoNombre,
      valor: parseFloat(nuevoPrecio),
      tipoId: parseInt(nuevoTipoId),
      usuarioId, 
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setNuevoNombre("");
    setNuevoPrecio("");
    setNuevoTipoId("");
    cargarGastos();
  };

  const eliminarGasto = async (id) => {
    await axios.delete(`${API_URL}/gastos/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    cargarGastos();
  };

  const empezarEdicion = (gasto) => {
    setEditandoId(gasto.id);
    setEditNombre(gasto.nombre);
    setEditValor(gasto.valor);
    setEditTipoId(gasto.tipoId);
  };

  const guardarEdicion = async () => {
    await axios.put(`${API_URL}/gastos/${editandoId}`, {
      nombre: editNombre,
      valor: parseFloat(editValor),
      tipoId: parseInt(editTipoId),
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditandoId(null);
    cargarGastos();
  };

  // Obtén el mes y año actual
  const now = new Date();
  const mesActualNum = now.getMonth();
  const anioActual = now.getFullYear();

  // Filtra los gastos del mes y año actual
  const gastosMesActual = gastos
    .filter(g => {
      const fecha = new Date(g.fecha);
      return fecha.getMonth() === mesActualNum && fecha.getFullYear() === anioActual;
    })
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  const total = gastosMesActual.reduce((suma, g) => suma + g.valor, 0);

  const gastosPorTipo = tipos.map(tipo => {
    const total = gastosMesActual
      .filter(g => g.tipoId === tipo.id)
      .reduce((sum, g) => sum + g.valor, 0);
    return {
      nombre: tipo.nombre,
      total,
      color: tipo.color || '#888'
    };
  }).filter(t => t.total > 0);

  // Prepara los datos para Chart.js
  const donutData = {
    labels: gastosPorTipo.map(t => t.nombre),
    datasets: [
      {
        data: gastosPorTipo.map(t => t.total),
        backgroundColor: gastosPorTipo.map(t => t.color),
        hoverBackgroundColor: gastosPorTipo.map(t => darkenColor(t.color, 0.25)), // oscurece 25%
        borderWidth: 2,
        borderColor: "#fff"
      }
    ]
  };

  return (
    <>
    <Navbar />
    <div className="dashboard-container">
      <h2>Mis gastos en el mes de {mesActual.charAt(0).toUpperCase() + mesActual.slice(1)}</h2>
      <br />
      <div className="dashboard-listado">
        <div className="dashboard-listado-header">
          <span>Nombre</span>
          <span>Tipo</span>
          <span>Valor</span>
          <span>Fecha</span>
          <span>Acciones</span>
        </div>
        <ul>
          {gastosMesActual.map((gasto) => {
            const abierto = gastoAbiertoId === gasto.id;
            return (
              <li
                key={gasto.id}
                className={`dashboard-listado-row${abierto ? " abierto" : ""}`}
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
                      <input
                        className="dashboard-form-input"
                        value={editNombre}
                        onChange={e => setEditNombre(e.target.value)}
                        placeholder="Nombre"
                      />
                    </span>
                    <span>
                      <select
                        className="dashboard-form-select"
                        value={editTipoId}
                        onChange={e => setEditTipoId(e.target.value)}
                      >
                        {tipos.map(tipo => (
                          <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                        ))}
                      </select>
                    </span>
                    <span>
                      <input
                        className="dashboard-form-input"
                        value={editValor}
                        onChange={e => setEditValor(e.target.value)}
                        placeholder="Valor"
                      />
                    </span>
                    <span>
                      {new Date(gasto.fecha).toLocaleDateString()}
                    </span>
                    <span>
                      <button className="dashboard-btn-small dashboard-form-guardar" onClick={guardarEdicion}>Guardar</button>
                      <button className="dashboard-btn-small dashboard-form-cancel" onClick={() => setEditandoId(null)}>Cancelar</button>
                    </span>
                  </>
                ) : (
                  <>
                    <span>{gasto.nombre}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                      {gasto.tipo?.nombre}
                      {gasto.tipo?.color && (
                        <span
                          style={{
                            display: "inline-block",
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: gasto.tipo.color,
                            border: "1.5px solid #fff",
                            marginLeft: 6
                          }}
                          title={gasto.tipo.color}
                        />
                      )}
                    </span>
                    <span>${gasto.valor}</span>
                    <span>{new Date(gasto.fecha).toLocaleDateString()}</span>
                    <span>
                      {abierto && (
                        <>
                          <button className="dashboard-btn-small" onClick={e => { e.stopPropagation(); empezarEdicion(gasto); }}>✏️</button>
                          <button className="dashboard-btn-small" onClick={e => { e.stopPropagation(); eliminarGasto(gasto.id); }}>❌</button>
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
          className="dashboard-listado-row"
          style={{ marginTop: 8 }}
          onSubmit={e => { e.preventDefault(); agregarGasto(); }}
        >
          <span>
            <input
              className="dashboard-form-input"
              placeholder="Nombre del gasto"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
          </span>
          <span>
            <select
              className="dashboard-form-select"
              value={nuevoTipoId}
              onChange={(e) => setNuevoTipoId(e.target.value)}
            >
              <option value="">-- Tipo de gasto --</option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </span>
          <span>
            <input
              className="dashboard-form-input"
              placeholder="Precio"
              value={nuevoPrecio}
              onChange={(e) => setNuevoPrecio(e.target.value)}
            />
          </span>
          <span>
            {/* Deja vacío o pon un guion para la columna de fecha */}
            –
          </span>
          <span>
            <button className="dashboard-btn-small" type="submit">
              Agregar
            </button>
          </span>
        </form>
      </div>
      <h3>Total gastado: ${total}</h3>
      <div className="dashboard-donut-container">
        <div className="dashboard-donut-title">Gastos por categoría</div>
        <div className="dashboard-donut-content">
          <Doughnut
            ref={chartRef}
            data={donutData}
            options={{
              plugins: {
                legend: { display: false },
                tooltip: {
                  bodyFont: { size: 18 },
                  callbacks: {
                    title: () => [],
                    label: function(context) {
                      return `${context.label}: $${context.parsed}`;
                    }
                  }
                }
              }
            }}
          />
          <div className="dashboard-donut-legend">
            {gastosPorTipo.map((tipo) => (
              <div key={tipo.nombre} className="dashboard-donut-legend-item">
                <span
                  className="dashboard-donut-legend-color"
                  style={{ background: tipo.color }}
                />
                <span className="dashboard-donut-legend-label">{tipo.nombre}</span>
                <span className="dashboard-donut-legend-total">
                  ${tipo.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
