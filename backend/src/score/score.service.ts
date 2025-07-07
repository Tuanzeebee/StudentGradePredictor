import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import axios from 'axios';

@Injectable()
export class ScoreService {
  constructor(private readonly prisma: PrismaService) {}

  async importFromCsv(filePath: string) {
    const rows = await this.readCsv(filePath);
    
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

    // Xóa dữ liệu cũ
    await this.prisma.predictedScore.deleteMany({
      where: { scoreRecord: { userId } }
    });
    await this.prisma.scoreRecord.deleteMany({
      where: { userId }
    });

    console.log(`🗑️ Deleted old records for user ${userId}`);

    for (const row of rows) {
      const semesterNumber = parseInt(row.semester_number) || 1;
      const year = row.year || '2023-2024';
      const courseCode = row.course_code;
      const studyFormat = row.study_format || 'LEC';
      const creditsUnit = parseInt(row.credits_unit) || 3;
      const rawScore = parseFloat(row.raw_score) || 0;
      const currentGpa = row.current_semester_gpa ? parseFloat(row.current_semester_gpa) : null;
      const cumulativeGpa = row.cumulative_gpa ? parseFloat(row.cumulative_gpa) : null;
      const previousCoursesTaken = parseInt(row.previous_courses_taken || '0');
      const previousCreditsEarned = parseInt(row.previous_credits_earned || '0');

      const weeklyStudyHours = parseFloat(row.weekly_study_hours || '0');
      const attendancePercentage = parseFloat(row.attendance_percentage || '0');
      const commuteTimeMinutes = parseFloat(row.commute_time_minutes || '0');
      const familySupport = parseInt(row.family_support || '0');

      // Tính feature phụ
      const studyHoursXAttendance = weeklyStudyHours * (attendancePercentage / 100);
      const attendanceXSupport = (attendancePercentage / 100) * familySupport;
      const fullInteractionFeature = weeklyStudyHours * commuteTimeMinutes * (attendancePercentage / 100) * familySupport;

      const expectedScoreHint = (
        attendancePercentage >= 85 ||
        (weeklyStudyHours >= 15 && attendancePercentage >= 90) ||
        (weeklyStudyHours >= 20 && attendancePercentage >= 70) ||
        (familySupport >= 4 && attendancePercentage >= 95) ||
        (familySupport >= 3 && attendancePercentage >= 85)
      ) ? 1 : 0;

      const failRateGeneral = Math.max(0, 1 - attendancePercentage / 100);
      const failRateMajor = Math.max(0, 1 - studyHoursXAttendance / 20);

      // Gọi FastAPI để dự đoán
      let predictedScore: number | null = null;
      try {
        const response = await axios.post('http://localhost:8000/predict', {
          semester_number: semesterNumber,
          course_code: courseCode,
          study_format: studyFormat,
          credits_unit: creditsUnit,
          weekly_study_hours: weeklyStudyHours,
          attendance_percentage: attendancePercentage,
          commute_time_minutes: commuteTimeMinutes,
          family_support: familySupport,
          study_hours_x_attendance: studyHoursXAttendance,
          attendance_x_support: attendanceXSupport,
          full_interaction_feature: fullInteractionFeature,
          expected_score_hint: expectedScoreHint,
          fail_rate_general: failRateGeneral,
          fail_rate_major: failRateMajor
        });
        predictedScore = response.data.predicted_score;
      } catch (error) {
        console.error(`❌ Gọi API dự đoán thất bại cho ${courseCode}:`, error.message);
      }

      // Lưu vào DB
      const score = await this.prisma.scoreRecord.create({
        data: {
          userId,
          semesterNumber,
          year,
          courseCode,
          studyFormat,
          creditsUnit,
          rawScore,
          currentSemesterGpa: currentGpa,
          cumulativeGpa: cumulativeGpa,
          previousCoursesTaken,
          previousCreditsEarned,
          weeklyStudyHours,
          attendancePercentage,
          commuteTimeMinutes,
          familySupport,
          studyHoursXAttendance,
          attendanceXSupport,
          fullInteractionFeature,
          predictedScores: {
            create: [
              {
                semesterNumber,
                year,
                courseCode,
                studyHoursXAttendance,
                attendanceXSupport,
                fullInteractionFeature,
                expectedScoreHint,
                failRateGeneral,
                failRateMajor,
                predictedScore
              },
            ],
          },
        },
      });

      console.log(`✔️ Saved record for ${score.courseCode}`);
    }

    fs.unlinkSync(filePath);
    return { message: `✅ Imported ${rows.length} records successfully` };
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
  async inferStudyFromScore(input: {
    rawScore: number;
    familySupport: number;
    commuteTimeMinutes: number;
    courseCode: string;
    studyFormat: string;
    creditsUnit: number;
    semesterNumber: number;
    year: string;
  }) {
    const candidates: { weeklyStudyHours: number; attendancePercentage: number; error: number }[] = [];
  
    for (let weekly = 5; weekly <= 25; weekly += 1) {
      for (let attend = 50; attend <= 100; attend += 5) {
        const sxa = weekly * (attend / 100);
        const axs = (attend / 100) * input.familySupport;
        const interaction = weekly * input.commuteTimeMinutes * (attend / 100) * input.familySupport;
  
        const hint = (
          attend >= 85 ||
          (weekly >= 15 && attend >= 90) ||
          (weekly >= 20 && attend >= 70) ||
          (input.familySupport >= 4 && attend >= 95) ||
          (input.familySupport >= 3 && attend >= 85)
        ) ? 1 : 0;
  
        const failRateGeneral = Math.max(0, 1 - attend / 100);
        const failRateMajor = Math.max(0, 1 - sxa / 20);
  
        const payload = {
          semester_number: input.semesterNumber,
          course_code: input.courseCode,
          study_format: input.studyFormat,
          credits_unit: input.creditsUnit,
          weekly_study_hours: weekly,
          attendance_percentage: attend,
          commute_time_minutes: input.commuteTimeMinutes,
          family_support: input.familySupport,
          study_hours_x_attendance: sxa,
          attendance_x_support: axs,
          full_interaction_feature: interaction,
          expected_score_hint: hint,
          fail_rate_general: failRateGeneral,
          fail_rate_major: failRateMajor
        };
  
        try {
          const res = await axios.post('http://localhost:8000/predict', payload);
          const predicted = res.data.predicted_score;
          const error = Math.abs(predicted - input.rawScore);
  
          candidates.push({ weeklyStudyHours: weekly, attendancePercentage: attend, error });
        } catch (e) {
          console.warn('Error calling ML:', e.message);
        }
      }
    }
  
    // Chọn best
    const best = candidates.sort((a, b) => a.error - b.error)[0];
    return best;
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
