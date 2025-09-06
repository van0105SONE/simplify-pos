-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_unitType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_unitType" ("createdAt", "id", "name") SELECT "createdAt", "id", "name" FROM "unitType";
DROP TABLE "unitType";
ALTER TABLE "new_unitType" RENAME TO "unitType";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
