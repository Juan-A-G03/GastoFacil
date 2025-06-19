// backend/src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// rutas
import usuarioRoutes from "./routes/usuario.routes.js";
import gastoRoutes from "./routes/gasto.routes.js";
import tipoRoutes from "./routes/tipo.routes.js";

const app = express();

// Midleware
app.use(cors());
app.use(express.json());

// usar las rutas

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/gastos", gastoRoutes);
app.use("/api/tipos", tipoRoutes);

// inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
