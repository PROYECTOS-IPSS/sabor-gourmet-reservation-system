-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3);
