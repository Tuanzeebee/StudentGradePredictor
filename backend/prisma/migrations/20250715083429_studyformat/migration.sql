/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseCode,semesterNumber,year,studyFormat]` on the table `ScoreRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ScoreRecord_userId_courseCode_semesterNumber_year_key";

-- CreateIndex
CREATE UNIQUE INDEX "ScoreRecord_userId_courseCode_semesterNumber_year_studyForm_key" ON "ScoreRecord"("userId", "courseCode", "semesterNumber", "year", "studyFormat");
