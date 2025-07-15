/*
  Warnings:

  - You are about to drop the column `expectedScoreHint` on the `PredictedScore` table. All the data in the column will be lost.
  - You are about to drop the column `failRateGeneral` on the `PredictedScore` table. All the data in the column will be lost.
  - You are about to drop the column `failRateMajor` on the `PredictedScore` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PredictedScore" DROP COLUMN "expectedScoreHint",
DROP COLUMN "failRateGeneral",
DROP COLUMN "failRateMajor",
ADD COLUMN     "familySupportXPartTimeHours" DOUBLE PRECISION,
ADD COLUMN     "studyHoursXPartPartTimeHours" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ScoreRecord" ADD COLUMN     "familySupportXPartTimeHours" DOUBLE PRECISION,
ADD COLUMN     "partTimeHours" DOUBLE PRECISION,
ADD COLUMN     "studyHoursXPartPartTimeHours" DOUBLE PRECISION,
ALTER COLUMN "previousCoursesTaken" SET DEFAULT 0,
ALTER COLUMN "previousCreditsEarned" SET DEFAULT 0;
