import { Router } from "express";
import { crearUsuario, loginUsuario, actualizarUsuario, actualizarAvatar, upload } from "../controllers/usuario.controller.js";

const router = Router();

// Definimos las rutas para crear usuario y login
router.post("/", crearUsuario);
router.post("/login", loginUsuario);
router.put("/:id", actualizarUsuario);
router.put("/:id/avatar", upload.single("avatar"), actualizarAvatar);

export default router;
