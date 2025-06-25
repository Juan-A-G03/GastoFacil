import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./EditProfile.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditProfile() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const usuarioId = usuario?.id;

  useEffect(() => {
    if (!nombre && usuario?.nombre) setNombre(usuario.nombre);
    if (!email && usuario?.email) setEmail(usuario.email);
    // NO hagas setAvatarPreview(usuario.avatar)
    // eslint-disable-next-line
  }, []);

  const BASE_URL = API_URL.replace("/api", "");
  const currentAvatar = avatarPreview
    ? avatarPreview
    : usuario?.avatar
    ? `${BASE_URL}${usuario.avatar}`
    : "/default-avatar.jpg";

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleAvatarChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }
    try {
      // Actualiza datos básicos
      await axios.put(
        `${API_URL}/usuarios/${usuarioId}`,
        {
          nombre,
          email,
          password: password || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let newAvatar = usuario.avatar;
      // Si hay avatar, súbelo aparte y usa la ruta real
      if (avatar) {
        const avatarData = new FormData();
        avatarData.append("avatar", avatar);
        const res = await axios.put(
          `${API_URL}/usuarios/${usuarioId}/avatar`,
          avatarData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        newAvatar = res.data.usuario.avatar;
      }

      setMensaje("Perfil actualizado");
      localStorage.setItem(
        "usuario",
        JSON.stringify({ ...usuario, nombre, email, avatar: newAvatar })
      );
    } catch {
      setMensaje("Error al actualizar perfil");
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="edit-profile-container">
          <div className="edit-profile-card">
            <h2>Editar Perfil</h2>
            {/* Avatar actual arriba */}
            <img
              src={currentAvatar}
              alt="Avatar"
              className="edit-profile-avatar-preview"
              style={{
                margin: "0 auto 2rem auto",
                display: "block",
                width: 120,
                height: 120,
              }}
            />
            <form className="edit-profile-form" onSubmit={handleSubmit}>
              {/* Drag & drop cuadrado solo para subir imagen */}
              <div
                className="edit-profile-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                style={{ marginBottom: "1.5rem" }}
              >
                <input
                  type="file"
                  accept="image/jpeg"
                  style={{ display: "none" }}
                  id="avatar-input"
                  onChange={handleAvatarChange}
                />
                <label
                  htmlFor="avatar-input"
                  className="edit-profile-dropzone-label"
                  style={{ width: "100%", cursor: "pointer" }}
                >
                  <span>
                    Arrastre aquí el archivo <b>.jpg</b>
                  </span>
                </label>
              </div>

              <label>
                Nombre:
                <input
                  className="edit-profile-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  className="edit-profile-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Nueva contraseña:
                <input
                  className="edit-profile-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label>
                Confirmar contraseña:
                <input
                  className="edit-profile-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>

              <button className="edit-profile-btn" type="submit">
                Guardar cambios
              </button>
              {mensaje && (
                <div className="edit-profile-message">{mensaje}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}