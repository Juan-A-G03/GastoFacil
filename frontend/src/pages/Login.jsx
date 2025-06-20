import { useState } from 'react';
import axios from 'axios';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/usuarios/login`, {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      setMensaje('✅ Login exitoso');

      // Redirigir o navegar (si usás react-router)
      window.location.href = '/';
    } catch (err) {
      setMensaje('❌ Error al iniciar sesión');
      console.error(err);
    }
  };

return (
  <div className="login-container">
    <form className="login-form" onSubmit={handleLogin}>
      <h2>Iniciar Sesión</h2>
      <div>
        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      </div>
      <div>
        <label>Contraseña:</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      </div>
      <button type="submit">Ingresar</button>
      <p>¿No tenés una cuenta?
        <a href="/register"> Registrate acá</a>
      </p>
      {mensaje && <p>{mensaje}</p>}
    </form>
  </div>
);
}