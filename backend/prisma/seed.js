import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Asegúrate de que estos tipoId existen y corresponden a tipos de gasto reales
  await prisma.gasto.createMany({
    data: [
      {
        nombre: 'Cine',
        valor: 2500,
        fecha: new Date('2025-05-05T20:00:00.000Z'),
        usuarioId: 1,
        tipoId: 1, // Ocio
      },
      {
        nombre: 'Hamburguesa',
        valor: 3500,
        fecha: new Date('2025-05-10T13:00:00.000Z'),
        usuarioId: 1,
        tipoId: 2, // Comida
      },
      {
        nombre: 'Subte',
        valor: 1200,
        fecha: new Date('2025-05-15T08:30:00.000Z'),
        usuarioId: 1,
        tipoId: 3, // Transporte
      },
      {
        nombre: 'Luz',
        valor: 8000,
        fecha: new Date('2025-05-20T18:00:00.000Z'),
        usuarioId: 1,
        tipoId: 4, // Servicios
      },
      {
        nombre: 'Pizza',
        valor: 4000,
        fecha: new Date('2025-05-18T21:00:00.000Z'),
        usuarioId: 1,
        tipoId: 2, // Comida (repite tipo)
      },
      {
        nombre: 'Taxi',
        valor: 2000,
        fecha: new Date('2025-05-22T23:00:00.000Z'),
        usuarioId: 1,
        tipoId: 3, // Transporte (repite tipo)
      },
    ],
  });
  console.log('Gastos insertados');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());