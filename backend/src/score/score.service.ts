import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import axios from 'axios';
import { SaveScoreDto } from './dto/save-score.dto';

const SUBJECT_TYPE_MAP: Record<string, 'major' | 'general'> = {
  /* … giữ nguyên … */
};

@Injectable()
export class ScoreService {
  constructor(private readonly prisma: PrismaService) {}

  // ────────────────────────────────────────────────────────────────────────────
  // IMPORT CSV
  // ────────────────────────────────────────────────────────────────────────────
  async importFromCsv(filePath: string, userId: number) {
    const rows = await this.readCsv(filePath);

    /* 1) xoá dữ liệu cũ */
    await this.prisma.predictedScore.deleteMany({ where: { scoreRecord: { userId } } });
    await this.prisma.scoreRecord.deleteMany({ where: { userId } });

    const records: any[] = [];

    // ───── STEP 1: PARSE & GỌI /REVERSE NẾU CẦN ─────
    for (const row of rows) {
      const semesterNumber       = +row.semester_number || 1;
      const year                 = row.year || '2023-2024';
      const courseCode           = row.course_code;
      const studyFormat          = row.study_format || 'LEC';
      const creditsUnit          = +row.credits_unit || 3;

      const rawScore             = +row.raw_score;
      const partTimeHours        = +row.part_time_hours;
      const attendancePercentage = +row.attendance_percentage;
      const familySupport        = +row.family_support;

      let weeklyStudyHours       = +row.weekly_study_hours;  // có thể NaN

      const canCallReverse =
        !isNaN(rawScore) &&
        !isNaN(partTimeHours) &&
        !isNaN(attendancePercentage) &&
        !isNaN(familySupport) &&
        isNaN(weeklyStudyHours);      // thiếu weeklyStudyHours

      if (canCallReverse) {
        try {
          const { data } = await axios.post('http://localhost:8000/reverse', {
            semester_number: semesterNumber,
            course_code: courseCode,
            study_format: studyFormat,
            credits_unit: creditsUnit,
            raw_score: rawScore,
            attendance_percentage: attendancePercentage,
            part_time_hours: partTimeHours,
            family_support: familySupport,
          });

          weeklyStudyHours = data.predicted_weekly_study_hours;
        } catch (e) {
          console.warn(`❌ Reverse failed [${courseCode}]: ${e.message}`);
        }
      }

      records.push({
        userId,
        semesterNumber,
        year,
        courseCode,
        studyFormat,
        creditsUnit,
        rawScore: isNaN(rawScore) ? null : rawScore,
        weeklyStudyHours: isNaN(weeklyStudyHours) ? null : weeklyStudyHours,
        attendancePercentage: isNaN(attendancePercentage) ? null : attendancePercentage,
        partTimeHours: isNaN(partTimeHours) ? null : partTimeHours,
        familySupport: isNaN(familySupport) ? null : familySupport,
      });
    }

    // ───── STEP 2: GÁN subjectType & TRUNG VỊ KHI THIẾU ─────
    const withType = records.map(r => ({
      ...r,
      subjectType: SUBJECT_TYPE_MAP[r.courseCode] || 'general',
    }));

    const med = (arr: number[], fallback = 12) =>
      arr.length ? arr.sort((a, b) => a - b)[Math.floor(arr.length / 2)] : fallback;

    const buckets: Record<'major' | 'general', { hours: number[]; att: number[] }> = {
      major: { hours: [], att: [] }, general: { hours: [], att: [] },
    };

    for (const r of withType) {
      if (r.weeklyStudyHours) buckets[r.subjectType].hours.push(r.weeklyStudyHours);
      if (r.attendancePercentage) buckets[r.subjectType].att.push(r.attendancePercentage);
    }

    for (const r of withType) {
      if (r.weeklyStudyHours === null)
        r.weeklyStudyHours = med(buckets[r.subjectType].hours);
      if (r.attendancePercentage === null)
        r.attendancePercentage = med(buckets[r.subjectType].att, 85);
    }

    // ───── STEP 3: LƯU scoreRecord & (GỌI /PREDICT NẾU ĐỦ) ─────
    for (const r of withType) {
      // interaction features đúng theo API mới
      const sxa  = r.weeklyStudyHours * (r.attendancePercentage / 100);
      const sxp  = r.weeklyStudyHours * r.partTimeHours;
      const fxp  = r.familySupport * r.partTimeHours;
      const axs  = (r.attendancePercentage / 100) * r.familySupport;
      const full = r.weeklyStudyHours * (r.attendancePercentage / 100) * r.partTimeHours * r.familySupport;
      
    //   const existing = await this.prisma.scoreRecord.findFirst({
    //   where: {
    //     userId: r.userId,
    //     courseCode: r.courseCode,
    //     semesterNumber: r.semesterNumber,
    //     year: r.year,
    //   },
    // });

    // if (existing) {
    //   console.warn(`⚠️ Đã tồn tại: ${r.courseCode} HK${r.semesterNumber}-${r.year}`);
    //   continue;
    // }
      const record = await this.prisma.scoreRecord.create({
        data: {
          user: { connect: { id: r.userId } },
          semesterNumber: r.semesterNumber,
          year: r.year,
          courseCode: r.courseCode,
          studyFormat: r.studyFormat,
          creditsUnit: r.creditsUnit,
          rawScore: r.rawScore,
          weeklyStudyHours: r.weeklyStudyHours,
          attendancePercentage: r.attendancePercentage,
          partTimeHours: r.partTimeHours,
          familySupport: r.familySupport,
          // interaction cols
          studyHoursXAttendance: sxa,
          studyHoursXPartPartTimeHours: sxp,
          familySupportXPartTimeHours: fxp,
          attendanceXSupport: axs,
          fullInteractionFeature: full,
        },
      });

      // đủ dữ liệu để gọi /predict?
      const canPredict = [r.weeklyStudyHours, r.attendancePercentage, r.partTimeHours, r.familySupport]
        .every(v => v !== null);

      if (canPredict) {
        try {
          const { data } = await axios.post('http://localhost:8000/predict', {
            semester_number: r.semesterNumber,
            course_code: r.courseCode,
            study_format: r.studyFormat,
            credits_unit: r.creditsUnit,
            weekly_study_hours: r.weeklyStudyHours,
            attendance_percentage: r.attendancePercentage,
            part_time_hours: r.partTimeHours,
            family_support: r.familySupport,
            study_hours_x_attendance: sxa,
            study_hours_x_part_part_time_hours: sxp,
            family_support_x_part_time_hours: fxp,
            attendance_x_support: axs,
            full_interaction_feature: full,
          });

          await this.prisma.predictedScore.create({
            data: {
              semesterNumber: r.semesterNumber,
              year: r.year,
              courseCode: r.courseCode,
              predictedScore: data.predicted_score,
              studyHoursXAttendance: sxa,
              studyHoursXPartPartTimeHours: sxp,
              familySupportXPartTimeHours: fxp,
              attendanceXSupport: axs,
              fullInteractionFeature: full,
              mode: 'MAIN',
              scoreRecord: { connect: { id: record.id } },
            },
          });
        } catch (e) {
          console.warn(`❌ Predict failed [${r.courseCode}]: ${e.message}`);
        }
      }
    }

    return { message: `✅ Imported ${rows.length} rows.` };
  }
  async doSomething(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error('User not found');
  }

  async getChartData(userId: number) {
    const records = await this.prisma.scoreRecord.findMany({
      where: { userId },
      include: { predictedScores: true },
    });

    return records.map((record) => ({
      courseCode: record.courseCode,
      semester: `HK${record.semesterNumber}-${record.year}`,
      semesterNumber: record.semesterNumber,
      year: record.year,
      studyFormat: record.studyFormat,
      creditsUnit: record.creditsUnit,
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

  async savePredictedScore(saveScoreDto: SaveScoreDto, userId: number) {
    const {
      semesterNumber,
      year,
      courseCode,
      predictedScore,
      weeklyStudyHours,
      attendancePercentage,
      commuteTimeMinutes,
      familySupport,
      studyFormat,
      creditsUnit,
    } = saveScoreDto;

    // Check if scoreRecord already exists
    let scoreRecord = await this.prisma.scoreRecord.findFirst({
      where: {
        userId,
        semesterNumber,
        year,
        courseCode,
        studyFormat,
      },
    });

    // If no existing record, create a new one
    if (!scoreRecord) {
      scoreRecord = await this.prisma.scoreRecord.create({
        data: {
          userId,
          semesterNumber,
          year,
          courseCode,
          studyFormat,
          creditsUnit,
          rawScore: null, // Will be filled when actual score is available
          currentSemesterGpa: null,
          cumulativeGpa: null,
          previousCoursesTaken: 0,
          commuteTimeMinutes,
          familySupport,
          weeklyStudyHours,
          attendancePercentage,
        },
      });
    } else {
      // Update existing record with new prediction data
      scoreRecord = await this.prisma.scoreRecord.update({
        where: { id: scoreRecord.id },
        data: {
          commuteTimeMinutes,
          familySupport,
          weeklyStudyHours,
          attendancePercentage,
        },
      });
    }

    // Delete existing prediction for this record
    await this.prisma.predictedScore.deleteMany({
      where: { scoreRecordId: scoreRecord.id },
    });

    // Create new prediction
    const prediction = await this.prisma.predictedScore.create({
      data: {
        scoreRecordId: scoreRecord.id,
        predictedScore,
        semesterNumber,
        year,
        courseCode,
        mode: 'auto-prediction',
      },
    });

    return {
      success: true,
      scoreRecord,
      prediction,
      message: 'Prediction saved successfully',
    };
  }
}
