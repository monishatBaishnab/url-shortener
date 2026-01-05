/*
  Warnings:

  - You are about to drop the column `profile_pic` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "profile_pic",
ADD COLUMN     "otp_code" TEXT,
ADD COLUMN     "otp_expired_at" TEXT,
ADD COLUMN     "otp_verified" BOOLEAN NOT NULL DEFAULT false;
