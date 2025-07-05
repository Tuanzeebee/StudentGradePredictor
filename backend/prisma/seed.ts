import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

const prisma = new PrismaClient();

async function main() {
  const csvPath = path.join(__dirname, '../data/bang_diem.csv');
  const records: any[] = [];

  // Đọc dữ liệu từ CSV
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => records.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  // Giả sử có sẵn một user để liên kết (id = 1)
  const userId = 1;

  for (const row of records) {
    // Tạo bản ghi ScoreRecord
    const score = await prisma.scoreRecord.create({
      data: {
        userId,
        semesterNumber: parseInt(row.semester_number),
        year: row.year,
        courseCode: row.course_code,
        studyFormat: row.study_format,
        creditsUnit: parseInt(row.credits_unit),
        rawScore: parseFloat(row.raw_score),
        currentSemesterGpa: row.current_semester_gpa ? parseFloat(row.current_semester_gpa) : null,
        cumulativeGpa: row.cumulative_gpa ? parseFloat(row.cumulative_gpa) : null,
        previousCoursesTaken: parseInt(row.previous_courses_taken || '0'),

        predictedScores: {
          create: [
            {
              semesterNumber: parseInt(row.semester_number),
              year: row.year,
              courseCode: row.course_code,
              expectedScore: parseFloat(row.expected_score_hint || '0'),
              failRateGeneral: parseFloat(row.fail_rate_general || '0'),
              failRateMajor: parseFloat(row.fail_rate_major || '0'),
              studyHoursXAttendance: parseFloat(row.study_hours_x_attendance || '0'),
              attendanceXSupport: parseFloat(row.attendance_x_support || '0'),
              interactionScore: parseFloat(row.full_interaction_feature || '0'),
              predictedScore: null // sẽ cập nhật sau
            }
          ]
        }
      }
    });

    console.log(`Imported: ${score.courseCode}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
