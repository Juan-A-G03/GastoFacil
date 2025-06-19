/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `TipoGasto` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TipoGasto_nombre_key" ON "TipoGasto"("nombre");
