/*
  Warnings:

  - You are about to drop the column `crr_code` on the `Currency` table. All the data in the column will be lost.
  - Added the required column `symbol` to the `Currency` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Currency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "currency_name" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL
);
INSERT INTO "new_Currency" ("currency_name", "id", "is_main") SELECT "currency_name", "id", "is_main" FROM "Currency";
DROP TABLE "Currency";
ALTER TABLE "new_Currency" RENAME TO "Currency";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
