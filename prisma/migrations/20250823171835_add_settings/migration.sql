-- CreateTable
CREATE TABLE "setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currency" TEXT NOT NULL,
    "currencySymbol" TEXT NOT NULL,
    "currencyPosition" TEXT NOT NULL,
    "decimalPlaces" INTEGER NOT NULL,
    "thousandSeparator" TEXT NOT NULL,
    "decimalSeparator" TEXT NOT NULL,
    "autoUpdateRates" BOOLEAN NOT NULL,
    "exchangeRateApiKey" TEXT NOT NULL,
    "taxRate" REAL NOT NULL,
    "taxName" TEXT NOT NULL,
    "taxInclusive" BOOLEAN NOT NULL,
    "showTaxSeparately" BOOLEAN NOT NULL,
    "taxNumber" TEXT NOT NULL,
    "showTaxNumberOnReceipts" BOOLEAN NOT NULL
);
