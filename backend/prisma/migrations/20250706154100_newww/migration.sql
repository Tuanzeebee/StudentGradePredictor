-- AlterTable
ALTER TABLE "ScoreRecord" ALTER COLUMN "weeklyStudyHours" DROP NOT NULL,
ALTER COLUMN "attendancePercentage" DROP NOT NULL,
ALTER COLUMN "commuteTimeMinutes" DROP NOT NULL,
ALTER COLUMN "familySupport" DROP NOT NULL,
ALTER COLUMN "studyHoursXAttendance" DROP NOT NULL,
ALTER COLUMN "attendanceXSupport" DROP NOT NULL,
ALTER COLUMN "fullInteractionFeature" DROP NOT NULL;
