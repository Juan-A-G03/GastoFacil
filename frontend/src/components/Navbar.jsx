import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className={`navbar-header${open ? " navbar-open" : ""}`}>
      <div className="navbar-logo">
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
      </div>
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
        </ul>
      </nav>
      {open && <div className="navbar-backdrop" onClick={() => setOpen(false)} />}
    </header>
  );
}