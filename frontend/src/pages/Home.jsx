import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  return (
    <div className="home-container">
      <div className="home-avatar-wrapper">
        <img
          src={
            usuario?.avatar
              ? `${API_URL}${usuario.avatar}`
              : "/default-avatar.jpg"
          }
          alt="Avatar"
          className="home-avatar"
        />
      </div>
      <h2 className="home-greeting">¡Hola, {usuario?.nombre || "Usuario"}!</h2>
      <div className="home-buttons">
        <button onClick={() => navigate("/")}>Gastos del mes</button>
        <button onClick={() => navigate("/historico")}>Historial de gastos</button>
        <button onClick={() => navigate("/tipos")}>Editar categorías de gasto</button>
        <button onClick={() => navigate("/editar-perfil")}>Editar perfil</button>
        <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
}