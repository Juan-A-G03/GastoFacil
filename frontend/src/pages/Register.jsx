import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/usuarios`, {
        nombre,
        email,
        password,
      });

      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      setMensaje('✅ Registro exitoso');
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error al registrarse');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Registrarse</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Nombre:</label><br />
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label><br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label><br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <br></br>
        <button type="submit">Registrarme</button>
      </form>
      <p>¿Ya tenés una cuenta? 
        <a href="/login"> Inicia sesión acá</a>
      </p>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
