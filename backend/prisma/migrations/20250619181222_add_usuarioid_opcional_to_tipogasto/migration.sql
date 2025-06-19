-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TipoGasto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "usuarioId" INTEGER,
    CONSTRAINT "TipoGasto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TipoGasto" ("color", "id", "nombre", "usuarioId") SELECT "color", "id", "nombre", "usuarioId" FROM "TipoGasto";
DROP TABLE "TipoGasto";
ALTER TABLE "new_TipoGasto" RENAME TO "TipoGasto";
CREATE UNIQUE INDEX "TipoGasto_nombre_key" ON "TipoGasto"("nombre");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
