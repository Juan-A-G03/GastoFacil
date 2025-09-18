import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // o el que uses
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendMail(to, subject, text) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}