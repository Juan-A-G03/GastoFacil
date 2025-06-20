import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <button
        className="navbar-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
      >
        ☰
      </button>
      <nav className={`navbar ${open ? "open" : ""}`}>
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
        </ul>
      </nav>
      {/* Fondo oscuro cuando el menú está abierto */}
      {open && <div className="navbar-backdrop" onClick={() => setOpen(false)} />}
    </>
  );
}