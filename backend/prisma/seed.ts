import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

const prisma = new PrismaClient();

async function main() {
  // Tạo user mẫu
  const user = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'Student A',
      password: 'hashed_password_123', // bạn nên hash trước
    },
  });

  // Dữ liệu ScoreRecord mẫu
  const records = [
    {
      semesterNumber: 1,
      year: '2024',
      courseCode: 'MATH101',
      studyFormat: 'offline',
      creditsUnit: 3,
      rawScore: 7.5,
      currentSemesterGpa: 3.0,
      cumulativeGpa: 3.0,
      previousCoursesTaken: 0,
      previousCreditsEarned: 0,
      weeklyStudyHours: 10,
      attendancePercentage: 90,
      commuteTimeMinutes: 20,
      familySupport: 2,
    },
    {
      semesterNumber: 2,
      year: '2024',
      courseCode: 'CS102',
      studyFormat: 'online',
      creditsUnit: 4,
      rawScore: 8.2,
      currentSemesterGpa: 3.2,
      cumulativeGpa: 3.1,
      previousCoursesTaken: 5,
      previousCreditsEarned: 15,
      weeklyStudyHours: 15,
      attendancePercentage: 100,
      commuteTimeMinutes: 30,
      familySupport: 3,
    },
  ];

  for (const r of records) {
    const sxa = r.weeklyStudyHours * (r.attendancePercentage / 100);
    const axs = (r.attendancePercentage / 100) * r.familySupport;
    const interaction = r.weeklyStudyHours * r.commuteTimeMinutes * (r.attendancePercentage / 100) * r.familySupport;

    const expectedScoreHint = (
      r.attendancePercentage >= 85 ||
      (r.weeklyStudyHours >= 15 && r.attendancePercentage >= 90) ||
      (r.weeklyStudyHours >= 20 && r.attendancePercentage >= 70) ||
      (r.familySupport >= 4 && r.attendancePercentage >= 95) ||
      (r.familySupport >= 3 && r.attendancePercentage >= 85)
    ) ? 1 : 0;

    const failRateGeneral = Math.max(0, 1 - r.attendancePercentage / 100);
    const failRateMajor = Math.max(0, 1 - sxa / 20);

    await prisma.scoreRecord.create({
      data: {
        userId: user.id,
        semesterNumber: r.semesterNumber,
        year: r.year,
        courseCode: r.courseCode,
        studyFormat: r.studyFormat,
        creditsUnit: r.creditsUnit,
        rawScore: r.rawScore,
        currentSemesterGpa: r.currentSemesterGpa,
        cumulativeGpa: r.cumulativeGpa,
        previousCoursesTaken: r.previousCoursesTaken,
        previousCreditsEarned: r.previousCreditsEarned,
        weeklyStudyHours: r.weeklyStudyHours,
        attendancePercentage: r.attendancePercentage,
        commuteTimeMinutes: r.commuteTimeMinutes,
        familySupport: r.familySupport,
        studyHoursXAttendance: sxa,
        attendanceXSupport: axs,
        fullInteractionFeature: interaction,
        predictedScores: {
          create: [
            {
              semesterNumber: r.semesterNumber,
              year: r.year,
              courseCode: r.courseCode,
              studyHoursXAttendance: sxa,
              attendanceXSupport: axs,
              fullInteractionFeature: interaction,
              expectedScoreHint: expectedScoreHint,
              failRateGeneral: failRateGeneral,
              failRateMajor: failRateMajor,
              predictedScore: null // có thể tính sau
            },
          ],
        },
      },
    });
  }
}

main()
  .then(() => {
    console.log('🌱 Seeding complete.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
