/*
  Warnings:

  - Added the required column `creditsUnit` to the `PredictedScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PredictedScore" ADD COLUMN     "creditsUnit" INTEGER NOT NULL;
