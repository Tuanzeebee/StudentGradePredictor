/*
  Warnings:

  - You are about to drop the column `attendanceXSupport` on the `PredictedScore` table. All the data in the column will be lost.
  - You are about to drop the column `familySupportXPartTimeHours` on the `PredictedScore` table. All the data in the column will be lost.
  - You are about to drop the column `fullInteractionFeature` on the `PredictedScore` table. All the data in the column will be lost.
  - You are about to drop the column `predictedAttendancePercent` on the `PredictedScore` table. All the data in the column will be lost.
  - You are about to drop the column `predictedWeeklyStudyHours` on the `PredictedScore` table. All the data in the column will be lost.
  - You are about to drop the column `studyHoursXAttendance` on the `PredictedScore` table. All the data in the column will be lost.
  - You are about to drop the column `studyHoursXPartPartTimeHours` on the `PredictedScore` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PredictedScore" DROP COLUMN "attendanceXSupport",
DROP COLUMN "familySupportXPartTimeHours",
DROP COLUMN "fullInteractionFeature",
DROP COLUMN "predictedAttendancePercent",
DROP COLUMN "predictedWeeklyStudyHours",
DROP COLUMN "studyHoursXAttendance",
DROP COLUMN "studyHoursXPartPartTimeHours",
ADD COLUMN     "convertedNumericScore" DOUBLE PRECISION,
ADD COLUMN     "convertedScore" TEXT;
