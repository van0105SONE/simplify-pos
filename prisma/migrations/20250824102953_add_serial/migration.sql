-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serial" TEXT NOT NULL DEFAULT '',
    "total" REAL NOT NULL,
    "tax" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "change" REAL NOT NULL DEFAULT 0,
    "payment_method" TEXT NOT NULL DEFAULT 'cash',
    "status" TEXT NOT NULL DEFAULT 'completed',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "table_id" INTEGER NOT NULL,
    "is_checkout" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Order_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "Table" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("change", "createdAt", "id", "is_checkout", "payment_method", "status", "subtotal", "table_id", "tax", "total") SELECT "change", "createdAt", "id", "is_checkout", "payment_method", "status", "subtotal", "table_id", "tax", "total" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
