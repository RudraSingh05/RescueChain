/*
  Warnings:

  - You are about to drop the column `email` on the `SupplierApplication` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SupplierApplication` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `SupplierApplication` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `SupplierApplication` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationName` to the `SupplierApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SupplierApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupplierApplication" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "password",
ADD COLUMN     "organizationName" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SupplierApplication_userId_key" ON "SupplierApplication"("userId");

-- AddForeignKey
ALTER TABLE "SupplierApplication" ADD CONSTRAINT "SupplierApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
