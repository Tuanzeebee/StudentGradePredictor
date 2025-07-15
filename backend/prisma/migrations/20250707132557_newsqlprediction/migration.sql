-- AlterTable
ALTER TABLE "PredictedScore" ADD COLUMN     "mode" TEXT,
ADD COLUMN     "predictedAttendancePercent" DOUBLE PRECISION,
ADD COLUMN     "predictedWeeklyStudyHours" DOUBLE PRECISION;
