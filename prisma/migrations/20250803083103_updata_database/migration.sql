/*
  Warnings:

  - You are about to drop the column `is_checkout` on the `OrderItems` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "total" REAL NOT NULL,
    "tax" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "table_id" INTEGER NOT NULL,
    "is_checkout" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Order_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "Table" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "id", "status", "subtotal", "table_id", "tax", "total") SELECT "createdAt", "id", "status", "subtotal", "table_id", "tax", "total" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_OrderItems" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "tableId" INTEGER,
    CONSTRAINT "OrderItems_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItems_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderItems" ("id", "order_id", "product_id", "tableId") SELECT "id", "order_id", "product_id", "tableId" FROM "OrderItems";
DROP TABLE "OrderItems";
ALTER TABLE "new_OrderItems" RENAME TO "OrderItems";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
