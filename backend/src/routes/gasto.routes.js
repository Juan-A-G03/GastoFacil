import { Router } from "express";
import { crearGasto, obtenerGastos, editarGasto, eliminarGasto } from "../controllers/gasto.controller.js";

const router = Router();

router.get("/", obtenerGastos);
router.post("/", crearGasto);
router.put("/:id", editarGasto);
router.delete("/:id", eliminarGasto);

export default router;
