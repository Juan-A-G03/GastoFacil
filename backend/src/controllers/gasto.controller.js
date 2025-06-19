import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


//crear un gasto
export const crearGasto = async (req, res) => {
  const { nombre, valor, usuarioId, tipoId } = req.body;

  try {
    const nuevoGasto = await prisma.gasto.create({
      data: {
        nombre,
        valor: parseFloat(valor),
        usuarioId,
        tipoId,
      },
    });

    res.json(nuevoGasto);
  } catch (error) {
    res.status(500).json({ error: "Error al crear gasto", detalle: error.message });
  }
};

//obtener los gastos del usuario
export const obtenerGastos = async (req, res) => {
  const { id } = req.params; // <-- Cambia aquí

  try {
    const gastos = await prisma.gasto.findMany({
      where: { usuarioId: parseInt(id) }, // <-- Cambia aquí
      include: {
        tipo: true,
      },
    });

    res.json(gastos);
  } catch (error) {
    console.error("Error al obtener gastos:", error); // Opcional para depurar
    res.status(500).json({ error: "Error al obtener gastos" });
  }
};

//modificar los gastos del usuario
export const editarGasto = async (req, res) => {
  const { id } = req.params;
  const { nombre, valor, tipoId } = req.body;

  try {
    const gastoEditado = await prisma.gasto.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        valor: parseFloat(valor),
        tipoId,
      },
    });

    res.json(gastoEditado);
  } catch (error) {
    res.status(500).json({ error: "Error al editar gasto" });
  }
};

//eliminar el gasto del usuario
export const eliminarGasto = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.gasto.delete({
      where: { id: parseInt(id) },
    });

    res.json({ mensaje: "Gasto eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar gasto" });
  }
};
