/*
  Warnings:

  - A unique constraint covering the columns `[supplierId,itemName]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Inventory_itemName_idx" ON "Inventory"("itemName");

-- CreateIndex
CREATE INDEX "Inventory_supplierId_idx" ON "Inventory"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_supplierId_itemName_key" ON "Inventory"("supplierId", "itemName");
