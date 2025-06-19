import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Nota: En un entorno real, nunca debo guardar contraseñas en texto plano.
// Siempre debo usar un hash seguro (bcrypt, argon2, etc.) para almacenar contraseñas.
// Aquí se omite el hash por simplicidad, pero debería implementarlo en producción.


// Controlador para crear un nuevo usuario
export const crearUsuario = async (req, res) => {
  const { nombre, email, password } = req.body;

  const existente = await prisma.usuario.findUnique({ where: { email } }); // busca si encuentra el mismo email registrado
  if (existente) return res.status(400).json({ error: "Email ya registrado" }); //valida

  const nuevo = await prisma.usuario.create({
    data: { nombre, email, password }, // sin hash por ahora
  }); //crea el user

  res.json(nuevo);
};


// Controlador para iniciar sesión
// Nota: En un entorno real, debería usar un sistema de autenticación más robusto.
export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario || usuario.password !== password) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  res.json({ mensaje: "Login correcto", usuarioId: usuario.id });
};