import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro";

// Multer: solo JPG y siempre con extensión .jpg
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".jpg");
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos .jpg"), false);
  }
};
const upload = multer({ storage, fileFilter });

const CATEGORIAS_POR_DEFECTO = [
  { nombre: 'Ocio', color: '#64b5f6' },
  { nombre: 'Hogar', color: '#81c784' },
  { nombre: 'Supermercado', color: '#ffd54f' },
  { nombre: 'Servicios', color: '#ba68c8' },
  { nombre: 'Transporte', color: '#4dd0e1' },
  { nombre: 'Comida', color: '#ff8a65' },
  { nombre: 'Ropa', color: '#a1887f' },
  { nombre: 'Otros', color: '#b0bec5' }
];

// Controlador para crear un nuevo usuario
export const crearUsuario = async (req, res) => {
  const { nombre, email, password } = req.body;

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) return res.status(400).json({ error: "Email ya registrado" });

  const hashed = await bcrypt.hash(password, 10);
  const nuevo = await prisma.usuario.create({
    data: { 
      nombre,
      email,
      password: hashed,
      avatar: "/uploads/avatar.png"
    },
  });

  // Crea las categorías por defecto para este usuario
  try {
    await Promise.all(
      CATEGORIAS_POR_DEFECTO.map(cat =>
        prisma.tipoGasto.create({
          data: {
            nombre: cat.nombre,
            color: cat.color,
            usuarioId: nuevo.id
          }
        })
      )
    );
  } catch (error) {
    console.error("Error al crear categorías por defecto:", error);
    return res.status(500).json({ error: "Error al crear categorías por defecto" });
  }

  // Genera token al registrar
  const token = jwt.sign({ id: nuevo.id, email: nuevo.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ usuario: nuevo, token });
};

// Controlador para iniciar sesión
export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) return res.status(401).json({ error: "Credenciales incorrectas" });

  const ok = await bcrypt.compare(password, usuario.password);
  if (!ok) return res.status(401).json({ error: "Credenciales incorrectas" });

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ usuario, token });
};

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password } = req.body;
  const data = { nombre, email };
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }
  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data,
    });
    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

export const actualizarAvatar = async (req, res) => {
  const { id } = req.params;
  if (!req.file) {
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }
  const avatarUrl = `/uploads/${req.file.filename}`;
  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { avatar: avatarUrl }
    });
    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar avatar" });
  }
};

// Exporta upload para usarlo en las rutas
export { upload };