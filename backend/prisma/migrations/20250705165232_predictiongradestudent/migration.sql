-- CreateTable
CREATE TABLE "ScoreRecord" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "semesterNumber" INTEGER NOT NULL,
    "year" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "studyFormat" TEXT NOT NULL,
    "creditsUnit" INTEGER NOT NULL,
    "rawScore" DOUBLE PRECISION NOT NULL,
    "currentSemesterGpa" DOUBLE PRECISION,
    "cumulativeGpa" DOUBLE PRECISION,
    "previousCoursesTaken" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScoreRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PredictedScore" (
    "id" SERIAL NOT NULL,
    "semesterNumber" INTEGER NOT NULL,
    "year" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "expectedScore" DOUBLE PRECISION,
    "failRateGeneral" DOUBLE PRECISION,
    "failRateMajor" DOUBLE PRECISION,
    "studyHoursXAttendance" DOUBLE PRECISION,
    "attendanceXSupport" DOUBLE PRECISION,
    "interactionScore" DOUBLE PRECISION,
    "predictedScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scoreRecordId" INTEGER,

    CONSTRAINT "PredictedScore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScoreRecord" ADD CONSTRAINT "ScoreRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PredictedScore" ADD CONSTRAINT "PredictedScore_scoreRecordId_fkey" FOREIGN KEY ("scoreRecordId") REFERENCES "ScoreRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;
