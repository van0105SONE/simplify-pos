/*
  Warnings:

  - Added the required column `day` to the `saleReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `saleReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `saleReport` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_saleReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total_revenue" BIGINT NOT NULL,
    "total_cost" BIGINT NOT NULL,
    "total_bill" INTEGER NOT NULL,
    "total_product" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_saleReport" ("id", "total_bill", "total_cost", "total_product", "total_revenue") SELECT "id", "total_bill", "total_cost", "total_product", "total_revenue" FROM "saleReport";
DROP TABLE "saleReport";
ALTER TABLE "new_saleReport" RENAME TO "saleReport";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
