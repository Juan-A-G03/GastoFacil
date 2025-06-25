import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./EditProfile.css"; // Importa el CSS del dashboard

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
    // Solo inicializa si los campos están vacíos
    if (!nombre && usuario?.nombre) setNombre(usuario.nombre);
    if (!email && usuario?.email) setEmail(usuario.email);
    if (!avatarPreview && usuario?.avatar) setAvatarPreview(usuario.avatar);
    // eslint-disable-next-line
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
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

      // Si hay avatar, súbelo aparte
      if (avatar) {
        const avatarData = new FormData();
        avatarData.append("avatar", avatar);
        await axios.put(
          `${API_URL}/usuarios/${usuarioId}/avatar`,
          avatarData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setMensaje("Perfil actualizado");
      localStorage.setItem(
        "usuario",
        JSON.stringify({ ...usuario, nombre, email, avatar: avatarPreview })
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
            <form className="edit-profile-form" onSubmit={handleSubmit}>
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

              <div
                className="edit-profile-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleAvatarChange({
                      target: { files: e.dataTransfer.files },
                    });
                  }
                }}
              >
                <input
                  type="file"
                  accept="image/jpeg"
                  id="avatar-input"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
                <label
                  htmlFor="avatar-input"
                  className="edit-profile-dropzone-label"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="edit-profile-avatar-preview"
                    />
                  ) : (
                    <span>
                      Arrastra tu imagen aquí o haz clic para seleccionar
                      <br />
                      <span
                        style={{
                          fontSize: "0.95em",
                          color: "#ffd54f",
                        }}
                      >
                        (Solo JPG, máx. 2MB)
                      </span>
                    </span>
                  )}
                </label>
              </div>

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