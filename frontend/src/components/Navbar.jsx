import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setOpen(false);
    navigate("/login");
  }

  return (
    <header className={`navbar-header${open ? " navbar-open" : ""}`}>
      <Link
        to="/home"
        className="navbar-logo"
        style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
      >
        <img
          src="/grafico.png"
          alt="Logo"
          style={{
            height: "2em",
            width: "2em",
            verticalAlign: "middle",
            marginRight: "0.6em"
          }}
        />
        <span style={{ display: "inline-block", marginTop: "0.18em" }}>
          GastoFacil <span style={{ fontSize: "1em" }}>↑↓</span>
        </span>
      </Link>
      <button
        className="navbar-toggle"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
      >
        ☰
      </button>
      <nav className={`navbar-slide ${open ? "open" : ""}`}>
        <button className="navbar-close" onClick={() => setOpen(false)}>
          ×
        </button>
        <ul>
          <li>
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/tipos"
              className={location.pathname === "/tipos" ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              Tipos de gastos
            </Link>
          </li>
          <li>
            <Link
              to="/historico"
              className={location.pathname === "/historico" ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              Histórico
            </Link>
          </li>
          <li>
            <Link
              to="/party"
              className={location.pathname === "/party" ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              Party Divider
            </Link>
          </li>
          <li>
            <Link
              to="/editar-perfil"
              className={location.pathname === "/editar-perfil" ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              Editar perfil
            </Link>
          </li>
          <li>
            <button
              className="navbar-link navbar-logout" onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </nav>
      {open && <div className="navbar-backdrop" onClick={() => setOpen(false)} />}
    </header>
  );
}