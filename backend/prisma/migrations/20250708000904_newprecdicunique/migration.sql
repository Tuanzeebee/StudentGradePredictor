/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseCode,semesterNumber,year]` on the table `ScoreRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ScoreRecord_userId_courseCode_semesterNumber_year_key" ON "ScoreRecord"("userId", "courseCode", "semesterNumber", "year");
