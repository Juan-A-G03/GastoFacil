import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//crear tipo de gasto
export const crearTipo = async (req, res) => {
  const { nombre, color, usuarioId } = req.body;

  try {
    const nuevoTipo = await prisma.tipoGasto.create({
      data: {
        nombre,
        color,
        usuarioId,
      },
    });

    res.json(nuevoTipo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear tipo de gasto" });
  }
};

//obtener tipo de gastos
export const obtenerTipos = async (req, res) => {
  const { usuarioId } = req.query;
  let tipos = [];

  try {
    if (usuarioId) {
      tipos = await prisma.tipoGasto.findMany({
        where: {
          OR: [
            { usuarioId: null },
            { usuarioId: parseInt(usuarioId) }
          ]
        }
      });
    } else {
      // Si no hay usuarioId, solo devuelve los generales
      tipos = await prisma.tipoGasto.findMany({
        where: { usuarioId: null }
      });
    }

    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tipos de gasto" });
  }
};

//modificar tipo de gasto
export const editarTipo = async (req, res) => {
  const { id } = req.params;
  const { nombre, color } = req.body;

  try {
    const tipoEditado = await prisma.tipoGasto.update({
      where: { id: parseInt(id) },
      data: { nombre, color },
    });

    res.json(tipoEditado);
  } catch (error) {
    res.status(500).json({ error: "Error al editar tipo" });
  }
};

//eliminar tipo de gastos
export const eliminarTipo = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.tipoGasto.delete({
      where: { id: parseInt(id) },
    });

    res.json({ mensaje: "Tipo de gasto eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar tipo" });
  }
};
