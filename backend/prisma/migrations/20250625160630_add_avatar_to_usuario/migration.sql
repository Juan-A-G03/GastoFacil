/*
  Warnings:

  - A unique constraint covering the columns `[nombre,usuarioId]` on the table `TipoGasto` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TipoGasto_nombre_key";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN "avatar" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TipoGasto_nombre_usuarioId_key" ON "TipoGasto"("nombre", "usuarioId");
