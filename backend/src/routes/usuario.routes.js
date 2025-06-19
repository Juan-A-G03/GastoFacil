import { Router } from "express";
import { crearUsuario, loginUsuario } from "../controllers/usuario.controller.js";

const router = Router(); //es una funcion para crear un router de express

// Definimos las rutas para crear usuario y login

router.post("/", crearUsuario);
router.post("/login", loginUsuario);

export default router;
