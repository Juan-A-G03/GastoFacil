import { Router } from "express";
import multer from "multer";
import { crearUsuario, loginUsuario, actualizarUsuario, actualizarAvatar } from "../controllers/usuario.controller.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Definimos las rutas para crear usuario y login
router.post("/", crearUsuario);
router.post("/login", loginUsuario);
router.put("/:id", actualizarUsuario);

// Usa la función del controlador aquí:
router.put("/:id/avatar", upload.single("avatar"), actualizarAvatar);

export default router;
