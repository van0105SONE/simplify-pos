/*
  Warnings:

  - Added the required column `created_by` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `Menues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `OrderItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `Table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `unitType` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    CONSTRAINT "Category_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("id", "name") SELECT "id", "name" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_Menues" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "unitType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT NOT NULL,
    CONSTRAINT "Menues_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Menues_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Menues" ("available", "category_id", "createdAt", "description", "id", "image", "name", "price", "stock", "unitType") SELECT "available", "category_id", "createdAt", "description", "id", "image", "name", "price", "stock", "unitType" FROM "Menues";
DROP TABLE "Menues";
ALTER TABLE "new_Menues" RENAME TO "Menues";
CREATE TABLE "new_OrderItems" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" TEXT NOT NULL,
    "menu_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "order_id" TEXT,
    "price" REAL NOT NULL,
    "is_checkout" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT NOT NULL,
    CONSTRAINT "OrderItems_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Menues" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItems_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OrderItems_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderItems" ("id", "is_checkout", "menu_name", "order_id", "price", "product_id", "quantity") SELECT "id", "is_checkout", "menu_name", "order_id", "price", "product_id", "quantity" FROM "OrderItems";
DROP TABLE "OrderItems";
ALTER TABLE "new_OrderItems" RENAME TO "OrderItems";
CREATE TABLE "new_Supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "stock" BIGINT NOT NULL,
    "import_price" BIGINT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'out',
    "created_by" TEXT NOT NULL,
    CONSTRAINT "Supplier_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Supplier" ("createdAt", "id", "import_price", "name", "status", "stock") SELECT "createdAt", "id", "import_price", "name", "status", "stock" FROM "Supplier";
DROP TABLE "Supplier";
ALTER TABLE "new_Supplier" RENAME TO "Supplier";
CREATE TABLE "new_Table" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "seat" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "created_by" TEXT NOT NULL,
    CONSTRAINT "Table_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Table" ("id", "name", "seat", "status") SELECT "id", "name", "seat", "status" FROM "Table";
DROP TABLE "Table";
ALTER TABLE "new_Table" RENAME TO "Table";
CREATE TABLE "new_unitType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    CONSTRAINT "unitType_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_unitType" ("createdAt", "id", "name") SELECT "createdAt", "id", "name" FROM "unitType";
DROP TABLE "unitType";
ALTER TABLE "new_unitType" RENAME TO "unitType";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
