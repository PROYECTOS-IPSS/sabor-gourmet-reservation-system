/*
  Warnings:

  - You are about to drop the column `cancelledAt` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "cancelledAt",
DROP COLUMN "completedAt";
