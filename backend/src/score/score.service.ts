import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class ScoreService {
  constructor(private readonly prisma: PrismaService) {}

  async importFromCsv(filePath: string) {
    const rows = await this.readCsv(filePath);
    
    // Tạo user mẫu nếu chưa có
    let user = await this.prisma.user.findUnique({ where: { id: 1 } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: 'sample@example.com',
          name: 'Sample User',
          password: 'hashedpassword'
        }
      });
    }
    const userId = user.id;

    for (const row of rows) {
      // Parse semesterNumber với fallback value
      const semesterNumber = parseInt(row.semester_number) || 1;
      
      const score = await this.prisma.scoreRecord.create({
        data: {
          user: {
            connect: { id: userId }
          },
          semesterNumber: semesterNumber,
          year: row.year || '2023-2024',
          courseCode: row.course_code,
          studyFormat: row.study_format || 'LEC',
          creditsUnit: parseInt(row.credits_unit) || 3,
          rawScore: parseFloat(row.raw_score) || 0,
          currentSemesterGpa: row.current_semester_gpa ? parseFloat(row.current_semester_gpa) : null,
          cumulativeGpa: row.cumulative_gpa ? parseFloat(row.cumulative_gpa) : null,
          previousCoursesTaken: parseInt(row.previous_courses_taken || '0'),

          predictedScores: {
            create: [
              {
                semesterNumber: semesterNumber,
                year: row.year || '2023-2024',
                courseCode: row.course_code,
                expectedScore: parseFloat(row.expected_score_hint || '0'),
                failRateGeneral: parseFloat(row.fail_rate_general || '0'),
                failRateMajor: parseFloat(row.fail_rate_major || '0'),
                studyHoursXAttendance: parseFloat(row.study_hours_x_attendance || '0'),
                attendanceXSupport: parseFloat(row.attendance_x_support || '0'),
                interactionScore: parseFloat(row.full_interaction_feature || '0'),
                predictedScore: null
              },
            ],
          },
        },
      });

      console.log(`Saved ${score.courseCode}`);
    }

    fs.unlinkSync(filePath); // xóa file sau khi xử lý xong
    return { message: `Imported ${rows.length} records successfully` };
  }
  async getChartData(userId: number) {
    const records = await this.prisma.scoreRecord.findMany({
      where: { userId },
      include: { predictedScores: true },
    });
  
    return records.map((record) => ({
      courseCode: record.courseCode,
      semester: `HK${record.semesterNumber}-${record.year}`,
      actual: record.rawScore,
      predicted: record.predictedScores[0]?.predictedScore ?? null,
    }));
  }
  
  private readCsv(path: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      fs.createReadStream(path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }
}
