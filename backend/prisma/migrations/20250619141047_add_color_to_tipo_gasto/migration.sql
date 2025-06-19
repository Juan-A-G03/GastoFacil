/*
  Warnings:

  - Added the required column `color` to the `TipoGasto` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TipoGasto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "TipoGasto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TipoGasto" ("id", "nombre", "usuarioId") SELECT "id", "nombre", "usuarioId" FROM "TipoGasto";
DROP TABLE "TipoGasto";
ALTER TABLE "new_TipoGasto" RENAME TO "TipoGasto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
