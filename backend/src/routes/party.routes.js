// filepath: c:\GastoFacil\backend\src\routes\party.routes.js
import { Router } from "express";
import { enviarResumenEmail } from "../controllers/party.controller.js";
import { verificarToken } from "../middlewares/auth.js";

const router = Router();

router.post("/enviar-email", verificarToken, enviarResumenEmail);

export default router;