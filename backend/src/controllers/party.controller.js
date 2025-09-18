import { sendMail } from "../utils/sendMail.js";

export const enviarResumenEmail = async (req, res) => {
  const { resumen } = req.body;
  // Suponiendo que usas autenticación y tienes el usuario en req.usuario
  const correo = req.usuario?.email;
  if (!correo) return res.status(400).json({ error: "No se encontró el email del usuario" });

  try {
    await sendMail(correo, "Resumen de gastos del evento", resumen);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "No se pudo enviar el email" });
  }
};