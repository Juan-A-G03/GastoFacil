import { useEffect, useState } from "react";

import axios from "axios";
import './Tipo.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Tipo() {
  const [tipos, setTipos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoColor, setNuevoColor] = useState("#888888");
  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editColor, setEditColor] = useState("#888888");

  const usuarioGuardado = localStorage.getItem("usuario");
  const usuarioId = usuarioGuardado && usuarioGuardado !== "undefined"
    ? JSON.parse(usuarioGuardado)?.id
    : null;

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (usuarioId) cargarTipos();
  }, [usuarioId]);

  const cargarTipos = async () => {
    const res = await axios.get(`${API_URL}/tipos?usuarioId=${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTipos(res.data);
  };

  const agregarTipo = async (e) => {
    e.preventDefault();
    if (!nuevoNombre) return;
    await axios.post(`${API_URL}/tipos`, {
      nombre: nuevoNombre,
      color: nuevoColor,
      usuarioId,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNuevoNombre("");
    setNuevoColor("#888888");
    cargarTipos();
  };

  const eliminarTipo = async (id) => {
    await axios.delete(`${API_URL}/tipos/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    cargarTipos();
  };

  const empezarEdicion = (tipo) => {
    setEditandoId(tipo.id);
    setEditNombre(tipo.nombre);
    setEditColor(tipo.color || "#888888");
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    await axios.put(`${API_URL}/tipos/${editandoId}`, {
      nombre: editNombre,
      color: editColor,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditandoId(null);
    cargarTipos();
  };

  return (
    <div className="tipo-container">
        <h2 className="tipo-title">Tipos de Gasto</h2>
        <ul className="tipo-list">
            {tipos.map(tipo =>
            editandoId === tipo.id ? (
                <li key={tipo.id} className="tipo-row">
                    <input
                        className="tipo-nombre"
                        type="text"
                        value={editNombre}
                        onChange={e => setEditNombre(e.target.value)}
                        placeholder="Nombre"
                        />
                    <input
                        type="color"
                        value={editColor}
                        onChange={e => setEditColor(e.target.value)}
                    />
                    <div className="tipo-row-buttons">
                        <button className="tipo-btn tipo-btn-green" onClick={guardarEdicion}>Guardar</button>
                        <button className="tipo-btn tipo-btn-cancel" onClick={() => setEditandoId(null)}>Cancelar</button>
                    </div>
                </li>
            ) : (
                <li key={tipo.id} className="tipo-row">
                    <span className="tipo-nombre">{tipo.nombre}</span>
                    <span
                        className="tipo-color-preview"
                        style={{ background: tipo.color }}
                        title={tipo.color}
                    ></span>
                    <div className="tipo-row-buttons">
                        <button className="tipo-btn" onClick={() => empezarEdicion(tipo)}>✏️</button>
                        <button className="tipo-btn tipo-btn-cancel" onClick={() => eliminarTipo(tipo.id)}>❌</button>
                    </div>
                </li>
            )
            )}
        </ul>
        <form className="tipo-form" onSubmit={agregarTipo}>
            <input
            type="text"
            placeholder="Nombre del tipo"
            value={nuevoNombre}
            onChange={e => setNuevoNombre(e.target.value)}
            />
            <input
            type="color"
            value={nuevoColor}
            onChange={e => setNuevoColor(e.target.value)}
            />
            <button type="submit">Agregar</button>
        </form>
    </div>
  );
}