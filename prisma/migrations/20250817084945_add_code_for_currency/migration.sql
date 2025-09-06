/*
  Warnings:

  - Added the required column `code` to the `Currency` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Currency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "currency_name" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL
);
INSERT INTO "new_Currency" ("currency_name", "id", "is_main", "symbol") SELECT "currency_name", "id", "is_main", "symbol" FROM "Currency";
DROP TABLE "Currency";
ALTER TABLE "new_Currency" RENAME TO "Currency";
CREATE UNIQUE INDEX "Currency_code_key" ON "Currency"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
