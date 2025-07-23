import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1️⃣  Tạo (hoặc lấy) user mẫu
  const user = await prisma.user.upsert({
    where:  { email: 'student@example.com' },
    update: {},
    create: {
      email:    'student@example.com',
      name:     'Student A',
      password: 'hashed_password_123',           // ⚠️  Nên hash thật trước khi seed
    },
  });

  // 2️⃣  Dữ liệu ScoreRecord mẫu
  const records = [
    {
      semesterNumber: 1,
      year:           '2024',
      courseCode:     'MATH101',
      courseName:     'Toán cao cấp A1',
      studyFormat:    'offline',
      creditsUnit:    3,
      rawScore:       7.5,
      weeklyStudyHours:     10,
      attendancePercentage: 90,
      partTimeHours:        20,   // 🔹 MỚI – giờ làm thêm / tuần
      familySupport:        2,
    },
    {
      semesterNumber: 2,
      year:           '2024',
      courseCode:     'CS102',
      courseName:     'Lập trình cơ sở',
      studyFormat:    'online',
      creditsUnit:    4,
      rawScore:       8.2,
      weeklyStudyHours:     15,
      attendancePercentage: 100,
      partTimeHours:        15,
      familySupport:        3,
    },
  ];

  // 3️⃣  Tạo score records + predictedScores
  for (const r of records) {
    const sxa = r.weeklyStudyHours * (r.attendancePercentage / 100);
    const sxp = r.weeklyStudyHours * r.partTimeHours;
    const fxp = r.familySupport   * r.partTimeHours;
    const axs = (r.attendancePercentage / 100) * r.familySupport;
    const full = r.weeklyStudyHours * (r.attendancePercentage / 100) * r.partTimeHours * r.familySupport;

    await prisma.scoreRecord.create({
      data: {
        userId:               user.id,
        semesterNumber:       r.semesterNumber,
        year:                 r.year,
        courseCode:           r.courseCode,
        courseName:           r.courseName,
        studyFormat:          r.studyFormat,
        creditsUnit:          r.creditsUnit,
        rawScore:             r.rawScore,
        previousCoursesTaken: 0,
        previousCreditsEarned:0,
        weeklyStudyHours:     r.weeklyStudyHours,
        attendancePercentage: r.attendancePercentage,
        partTimeHours:        r.partTimeHours,
        familySupport:        r.familySupport,
        //interaction cols
        studyHoursXAttendance:        sxa,
        studyHoursXPartPartTimeHours: sxp,
        familySupportXPartTimeHours:  fxp,
        attendanceXSupport:           axs,
        fullInteractionFeature:       full,
        predictedScores: {
          create: [
            {
              semesterNumber:             r.semesterNumber,
              year:                       r.year,
              courseCode:                 r.courseCode,
              courseName:                 r.courseName,
              creditsUnit:                r.creditsUnit,
              // giữ chỗ predictedScore = null (tính sau)
              predictedScore:             null,
              convertedNumericScore:      null,
              convertedScore:             null,
              mode: 'SEED',
            },
          ],
        },
      },
    });
  }
}

main()
  .then(() => {
    console.log('🌱  Seeding complete.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
