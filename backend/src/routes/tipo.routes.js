import { Router } from "express";
import { crearTipo, obtenerTipos, editarTipo, eliminarTipo } from "../controllers/tipo.controller.js";

const router = Router();

router.get("/", obtenerTipos);
router.post("/", crearTipo);
router.put("/:id", editarTipo);
router.delete("/:id", eliminarTipo);

export default router;
