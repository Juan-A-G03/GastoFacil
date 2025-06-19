// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tiposGasto = [
    { nombre: 'Ropa', color: '#F8BBD0' },
    { nombre: 'Supermercado', color: '#B2EBF2' },
    { nombre: 'Kiosko', color: '#FFF9C4' },
    { nombre: 'Impuestos', color: '#C8E6C9' },
    { nombre: 'Vehículo', color: '#D1C4E9' },
    { nombre: 'Servicios', color: '#FFE0B2' },
    { nombre: 'Ocio', color: '#E0E0E0' },
  ];

  for (const tipo of tiposGasto) {
    await prisma.tipoGasto.upsert({
      where: { nombre: tipo.nombre },
      update: {},
      create: tipo,
    });
  }

  console.log('Tipos de gasto precargados con éxito!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
