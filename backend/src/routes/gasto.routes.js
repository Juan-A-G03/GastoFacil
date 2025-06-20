import { Router } from "express";
import { crearGasto, obtenerGastos, editarGasto, eliminarGasto } from "../controllers/gasto.controller.js";
import { verificarToken } from "../middlewares/auth.js";

const router = Router();

router.use(verificarToken);

router.get("/usuario/:id", obtenerGastos);
router.post("/", crearGasto);
router.put("/:id", editarGasto);
router.delete("/:id", eliminarGasto);

export default router;
