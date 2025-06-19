import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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

  const mesActual = new Date().toLocaleString("es-ES", { month: "long" });

  //const usuarioId = JSON.parse(localStorage.getItem("usuario"))?.id;
  const usuarioGuardado = localStorage.getItem("usuario");
  const usuarioId = usuarioGuardado && usuarioGuardado !== "undefined"
  ? JSON.parse(usuarioGuardado)?.id
  : null;

  useEffect(() => {
    console.log("usuarioId en useEffect:", usuarioId);
    if (usuarioId) {
      cargarTipos();
      cargarGastos();
    }
  }, [usuarioId]);

  const cargarGastos = async () => {
    const res = await axios.get(`${API_URL}/gastos/usuario/${usuarioId}`);
    setGastos(res.data);
  };

  const cargarTipos = async () => {
    const res = await axios.get(`${API_URL}/tipos?usuarioId=${usuarioId}`);
    console.log("Tipos recibidos:", res.data);
    setTipos(res.data);
  };

  const agregarGasto = async () => {
    if (!nuevoNombre || !nuevoPrecio || !nuevoTipoId) return;

    await axios.post(`${API_URL}/gastos`, {
      nombre: nuevoNombre,
      valor: parseFloat(nuevoPrecio),
      tipoId: parseInt(nuevoTipoId),
      usuarioId,
    });

    setNuevoNombre("");
    setNuevoPrecio("");
    setNuevoTipoId("");
    cargarGastos();
  };

  const eliminarGasto = async (id) => {
    await axios.delete(`${API_URL}/gastos/${id}`);
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
    });
    setEditandoId(null);
    cargarGastos();
  };

  const total = gastos.reduce((suma, g) => suma + g.valor, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Mis gastos en el mes de {mesActual.charAt(0).toUpperCase() + mesActual.slice(1)}</h2>

      <ul>
        {gastos.map((gasto) =>
          editandoId === gasto.id ? (
            <li key={gasto.id} style={{ marginBottom: "0.5rem" }}>
              <input
                value={editNombre}
                onChange={e => setEditNombre(e.target.value)}
              />
              <input
                value={editValor}
                onChange={e => setEditValor(e.target.value)}
              />
              <select
                value={editTipoId}
                onChange={e => setEditTipoId(e.target.value)}
              >
                {tipos.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
              <button onClick={guardarEdicion}>Guardar</button>
              <button onClick={() => setEditandoId(null)}>Cancelar</button>
            </li>
          ) : (
            <li key={gasto.id} style={{ marginBottom: "0.5rem" }}>
              {gasto.nombre} - {gasto.tipo?.nombre} - ${gasto.valor} - {new Date(gasto.fecha).toLocaleDateString()}
              &nbsp;
              <button onClick={() => eliminarGasto(gasto.id)}>❌</button>
              &nbsp;
              <button onClick={() => empezarEdicion(gasto)}>📝</button>
            </li>
          )
        )}
      </ul>

      <hr />

      <h3>Agregar nuevo gasto</h3>
      <input
        placeholder="Nombre del gasto"
        value={nuevoNombre}
        onChange={(e) => setNuevoNombre(e.target.value)}
      />
      <input
        placeholder="Precio"
        value={nuevoPrecio}
        onChange={(e) => setNuevoPrecio(e.target.value)}
      />
      <select
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

      <button onClick={agregarGasto}>Agregar</button>

      <hr />

      <h3>Total gastado: ${total}</h3>
    </div>
  );
}
