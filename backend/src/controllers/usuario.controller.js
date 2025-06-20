import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro";

const CATEGORIAS_POR_DEFECTO = [
  { nombre: 'Ocio', color: '#64b5f6' },         // Celeste
  { nombre: 'Hogar', color: '#81c784' },        // Verde suave
  { nombre: 'Supermercado', color: '#ffd54f' }, // Amarillo suave
  { nombre: 'Servicios', color: '#ba68c8' },    // Violeta suave
  { nombre: 'Transporte', color: '#4dd0e1' },   // Turquesa
  { nombre: 'Comida', color: '#ff8a65' },       // Naranja suave
  { nombre: 'Ropa', color: '#a1887f' },         // Marrón claro
  { nombre: 'Otros', color: '#b0bec5' }         // Gris azulado
];

// Nota: En un entorno real, nunca debo guardar contraseñas en texto plano.
// Siempre debo usar un hash seguro (bcrypt, argon2, etc.) para almacenar contraseñas.
// Aquí se omite el hash por simplicidad, pero debería implementarlo en producción.

// Controlador para crear un nuevo usuario
export const crearUsuario = async (req, res) => {
  const { nombre, email, password } = req.body;

  const existente = await prisma.usuario.findUnique({ where: { email } }); // busca si encuentra el mismo email registrado
  if (existente) return res.status(400).json({ error: "Email ya registrado" }); //valida

  const hashed = await bcrypt.hash(password, 10);
  const nuevo = await prisma.usuario.create({
    data: { nombre, email, password: hashed }, // sin hash por ahora
  }); //crea el user

  // Crea las categorías por defecto para este usuario
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

  // Genera token al registrar
  const token = jwt.sign({ id: nuevo.id, email: nuevo.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ usuario: nuevo, token });
};

// Controlador para iniciar sesión
// Nota: En un entorno real, debería usar un sistema de autenticación más robusto.
export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) return res.status(401).json({ error: "Credenciales incorrectas" });

  const ok = await bcrypt.compare(password, usuario.password);
  if (!ok) return res.status(401).json({ error: "Credenciales incorrectas" });

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ usuario, token });
};