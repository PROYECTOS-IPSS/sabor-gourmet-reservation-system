ALTER TABLE "Reservation" ADD COLUMN "confirmationCode" TEXT;

UPDATE "Reservation"
SET "confirmationCode" = 'SG-' || LPAD("id"::text, 6, '0')
WHERE "confirmationCode" IS NULL;

ALTER TABLE "Reservation" ALTER COLUMN "confirmationCode" SET NOT NULL;

CREATE UNIQUE INDEX "Reservation_confirmationCode_key" ON "Reservation"("confirmationCode");
