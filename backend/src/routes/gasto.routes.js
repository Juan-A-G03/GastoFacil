import { Router } from "express";
import { crearGasto, obtenerGastos, editarGasto, eliminarGasto, obtenerHistoricoPorMes } from "../controllers/gasto.controller.js";
import { verificarToken } from "../middlewares/auth.js";

const router = Router();

router.use(verificarToken);

router.get("/usuario/:id", obtenerGastos);
router.post("/", crearGasto);
router.put("/:id", editarGasto);
router.delete("/:id", eliminarGasto);
router.get("/historico/:id", obtenerHistoricoPorMes); // sin verificarToken

export default router;
