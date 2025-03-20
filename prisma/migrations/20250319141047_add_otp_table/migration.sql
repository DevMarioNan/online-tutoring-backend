/*
  Warnings:

  - You are about to drop the column `otp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiresAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "otp",
DROP COLUMN "otpExpiresAt";

-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "otpExpiresAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
