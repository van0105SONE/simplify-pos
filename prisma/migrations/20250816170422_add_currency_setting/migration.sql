-- CreateTable
CREATE TABLE "Currency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "crr_code" TEXT NOT NULL,
    "currency_name" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderItems" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" TEXT NOT NULL,
    "menu_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "order_id" TEXT,
    "price" REAL NOT NULL,
    CONSTRAINT "OrderItems_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Menues" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItems_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_OrderItems" ("id", "menu_name", "order_id", "price", "product_id", "quantity") SELECT "id", "menu_name", "order_id", "price", "product_id", "quantity" FROM "OrderItems";
DROP TABLE "OrderItems";
ALTER TABLE "new_OrderItems" RENAME TO "OrderItems";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
