-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_reservationId_key" ON "Delivery"("reservationId");

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
