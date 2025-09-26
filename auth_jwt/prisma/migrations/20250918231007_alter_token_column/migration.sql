/*
  Warnings:

  - You are about to alter the column `type` on the `token` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `token` MODIFY `token` VARCHAR(255) NOT NULL,
    MODIFY `type` VARCHAR(191) NOT NULL;
