import { useState } from 'react';
import axios from 'axios';

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

      // Suponiendo que el backend responde con { usuario: {...} }
      const usuario = res.data.usuario;
      localStorage.setItem('usuario', JSON.stringify(usuario));
      setMensaje('✅ Login exitoso');

      // Redirigir o navegar (si usás react-router)
      window.location.href = '/';
    } catch (err) {
      setMensaje('❌ Error al iniciar sesión');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label><br />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Contraseña:</label><br />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        <br></br>
        <button type="submit">Ingresar</button>
      </form>
      <p>¿No tenés una cuenta? 
        <a href="/register"> Registrate acá</a>
      </p>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
