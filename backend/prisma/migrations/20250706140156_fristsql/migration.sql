-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN DEFAULT false,
    "authorId" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

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
    "previousCreditsEarned" INTEGER NOT NULL,
    "weeklyStudyHours" DOUBLE PRECISION NOT NULL,
    "attendancePercentage" DOUBLE PRECISION NOT NULL,
    "commuteTimeMinutes" DOUBLE PRECISION NOT NULL,
    "familySupport" DOUBLE PRECISION NOT NULL,
    "studyHoursXAttendance" DOUBLE PRECISION NOT NULL,
    "attendanceXSupport" DOUBLE PRECISION NOT NULL,
    "fullInteractionFeature" DOUBLE PRECISION NOT NULL,
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
    "expectedScoreHint" DOUBLE PRECISION,
    "failRateGeneral" DOUBLE PRECISION,
    "failRateMajor" DOUBLE PRECISION,
    "studyHoursXAttendance" DOUBLE PRECISION,
    "attendanceXSupport" DOUBLE PRECISION,
    "fullInteractionFeature" DOUBLE PRECISION,
    "predictedScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scoreRecordId" INTEGER,

    CONSTRAINT "PredictedScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreRecord" ADD CONSTRAINT "ScoreRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PredictedScore" ADD CONSTRAINT "PredictedScore_scoreRecordId_fkey" FOREIGN KEY ("scoreRecordId") REFERENCES "ScoreRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;
