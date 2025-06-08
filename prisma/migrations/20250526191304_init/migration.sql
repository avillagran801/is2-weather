/*
  Warnings:

  - You are about to drop the column `precipitation` on the `Activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "precipitation",
ADD COLUMN     "maxRain" INTEGER,
ADD COLUMN     "maxSnow" INTEGER,
ADD COLUMN     "snow" BOOLEAN;
