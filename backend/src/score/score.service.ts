import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import axios from 'axios';
import { SaveScoreDto } from './dto/save-score.dto';

const SUBJECT_TYPE_MAP: Record<string, 'major' | 'general'> = {
    'CMU-SE 100': 'major',
    'CS 201': 'general',
    'CS 211': 'major',
    'DTE-IS 102': 'major',
    'IS-ENG 136': 'major',
    'CHE 101': 'general',
    'CMU-CS 252': 'major',
    'CMU-CS 311': 'major',
    'DTE-IS 152': 'major',
    'IS-ENG 137': 'major',
    'IS-ENG 186': 'major',
    'MTH 103': 'general',
    'COM 141': 'general',
    'PHY 101': 'major',
    'CMU-CS 303': 'major',
    'CMU-SE 214': 'major',
    'HIS 222': 'general',
    'IS-ENG 187': 'major',
    'IS-ENG 236': 'major',
    'MTH 104': 'general',
    'PHI 100': 'general',
    'CMU-CS 246': 'major',
    'CMU-CS 297': 'major',
    'CMU-CS 316': 'major',
    'CMU-ENG 130': 'major',
    'COM 142': 'general',
    'EVR 205': 'general',
    'MTH 254': 'major',
    'STA 151': 'general',
    'CMU-IS 432': 'major',
    'CMU-SE 252': 'major',
    'CMU-SE 303': 'major',
    'IS 301': 'major',
    'MTH 291': 'major',
    'PHI 150': 'general',
    'CMU-CS 445': 'major',
    'CMU-CS 447': 'major',
    'CMU-CS 462': 'major',
    'CMU-ENG 230': 'major',
    'CS 464': 'major',
    'MTH 203': 'general',
    'MTH 204': 'general',
    'MTH 341': 'major',
    'CMU-IS 401': 'major',
    'CS 466': 'major',
    'LAW 201': 'general',
    'POS 151': 'general',
    'POS 361': 'general',
    'HIS 221': 'general',
    'CMU-SE 450': 'major',
    'CMU-SE 403': 'major',
    'CMU-SE 451': 'major',
    'CMU-SE 433': 'major',
    'POS 351':'general',
    'HIS 362':'general',
    'IS 385': 'general',
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

      // FIX: Properly handle empty/null raw_score
      const rawScoreValue = row.raw_score?.toString().trim();
      const rawScore = rawScoreValue && rawScoreValue !== '' ? +rawScoreValue : NaN;

      // FIX: Handle other numeric fields properly
      const partTimeHoursValue = row.part_time_hours?.toString().trim();
      const partTimeHours = partTimeHoursValue && partTimeHoursValue !== '' ? +partTimeHoursValue : NaN;

      const attendanceValue = row.attendance_percentage?.toString().trim();
      const attendancePercentage = attendanceValue && attendanceValue !== '' ? +attendanceValue : NaN;

      const familySupportValue = row.family_support?.toString().trim();
      const familySupport = familySupportValue && familySupportValue !== '' ? +familySupportValue : NaN;

      const weeklyStudyValue = row.weekly_study_hours?.toString().trim();
      let weeklyStudyHours = weeklyStudyValue && weeklyStudyValue !== '' ? +weeklyStudyValue : NaN;

      // Parse GPA and course info from CSV
      const currentSemesterGpaValue = row.current_semester_gpa?.toString().trim();
      const currentSemesterGpa = currentSemesterGpaValue && currentSemesterGpaValue !== '' ? +currentSemesterGpaValue : null;

      const cumulativeGpaValue = row.cumulative_gpa?.toString().trim();
      const cumulativeGpa = cumulativeGpaValue && cumulativeGpaValue !== '' ? +cumulativeGpaValue : null;

      const previousCoursesTakenValue = row.previous_courses_taken?.toString().trim();
      const previousCoursesTaken = previousCoursesTakenValue && previousCoursesTakenValue !== '' ? +previousCoursesTakenValue : 0;

      const previousCreditsEarnedValue = row.previous_credits_earned?.toString().trim();
      const previousCreditsEarned = previousCreditsEarnedValue && previousCreditsEarnedValue !== '' ? +previousCreditsEarnedValue : 0;

      // Parse converted score fields from CSV, or calculate from rawScore if available
      const convertedScore = row.converted_score?.toString().trim() || 
        (!isNaN(rawScore) ? this.convertRawScoreToLetterGrade(rawScore) : null);
      
      const convertedNumericScoreValue = row.converted_numeric_score?.toString().trim();
      const convertedNumericScore = convertedNumericScoreValue && convertedNumericScoreValue !== '' ? 
        +convertedNumericScoreValue : 
        (!isNaN(rawScore) ? this.convertRawScoreToGPA(rawScore) : null);

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
          console.warn(`Reverse failed [${courseCode}]: ${e.message}`);
        }
      }

      const recordData = {
        userId,
        semesterNumber,
        year,
        courseCode,
        studyFormat,
        creditsUnit,
        rawScore: isNaN(rawScore) ? null : rawScore,
        convertedScore,
        convertedNumericScore,
        weeklyStudyHours: isNaN(weeklyStudyHours) ? null : weeklyStudyHours,
        attendancePercentage: isNaN(attendancePercentage) ? null : attendancePercentage,
        partTimeHours: isNaN(partTimeHours) ? null : partTimeHours,
        familySupport: isNaN(familySupport) ? null : familySupport,
        // GPA and course info from CSV
        currentSemesterGpa,
        cumulativeGpa,
        previousCoursesTaken,
        previousCreditsEarned,
      };

      records.push(recordData);
    }

    // ───── STEP 2: LƯU scoreRecord & (GỌI /PREDICT NẾU ĐỦ) ─────
    for (const r of records) {
      // Tính interaction features, xử lý null values
      const sxa = (r.weeklyStudyHours && r.attendancePercentage) 
        ? r.weeklyStudyHours * (r.attendancePercentage / 100) 
        : null;
      const sxp = (r.weeklyStudyHours && r.partTimeHours) 
        ? r.weeklyStudyHours * r.partTimeHours 
        : null;
      const fxp = (r.familySupport && r.partTimeHours) 
        ? r.familySupport * r.partTimeHours 
        : null;
      const axs = (r.attendancePercentage && r.familySupport) 
        ? (r.attendancePercentage / 100) * r.familySupport 
        : null;
      const full = (r.weeklyStudyHours && r.attendancePercentage && r.partTimeHours && r.familySupport)
        ? r.weeklyStudyHours * (r.attendancePercentage / 100) * r.partTimeHours * r.familySupport 
        : null;
      
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
          convertedScore: r.convertedScore,
          convertedNumericScore: r.convertedNumericScore,
          currentSemesterGpa: r.currentSemesterGpa,
          cumulativeGpa: r.cumulativeGpa,
          previousCoursesTaken: r.previousCoursesTaken,
          previousCreditsEarned: r.previousCreditsEarned,
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

      // Add this record to savedRecords for next iteration's calculations
      // (không cần nữa vì không tính toán)

      // đủ dữ liệu để gọi /predict? (kiểm tra cả null và NaN)
      const canPredict = [r.weeklyStudyHours, r.attendancePercentage, r.partTimeHours, r.familySupport]
        .every(v => v !== null && !isNaN(v));

      let predictedScoreValue = null;

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

          predictedScoreValue = data.predicted_score;
        } catch (e) {
          console.warn(`Predict failed [${r.courseCode}]: ${e.message}`);
        }
      }

      // Luôn tạo PredictedScore cho mọi môn học, dù có predict được hay không
      await this.prisma.predictedScore.create({
        data: {
          semesterNumber: r.semesterNumber,
          year: r.year,
          courseCode: r.courseCode,
          creditsUnit: r.creditsUnit,
          predictedScore: predictedScoreValue, // null nếu không predict được
          convertedNumericScore: predictedScoreValue ? this.convertRawScoreToGPA(predictedScoreValue) : null,
          convertedScore: predictedScoreValue ? this.convertRawScoreToLetterGrade(predictedScoreValue) : null,
          mode: 'MAIN',
          scoreRecord: { connect: { id: record.id } },
        },
      });
    }

    // Gọi method fillMissingValuesWithMedian để điền các giá trị thiếu
    await this.fillMissingValuesWithMedian(userId);

    // Đếm số predicted scores được tạo
    const predictedScoreCount = await this.prisma.predictedScore.count({
      where: { scoreRecord: { userId } }
    });

    const predictedScoreWithValues = await this.prisma.predictedScore.count({
      where: { 
        scoreRecord: { userId },
        predictedScore: { not: null }
      }
    });

    return { 
      message: `Successfully imported ${rows.length} rows from CSV.`,
      summary: {
        totalRecords: records.length,
        recordsWithScores: records.filter(r => r.rawScore !== null).length,
        recordsWithoutScores: records.filter(r => r.rawScore === null).length,
        predictedScoresCreated: predictedScoreCount,
        predictedScoresWithValues: predictedScoreWithValues,
        predictedScoresWithNullValues: predictedScoreCount - predictedScoreWithValues,
        esCoursesExcluded: records.filter(r => r.courseCode.startsWith('ES')).length,
        totalCreditsProcessed: records.reduce((sum, r) => sum + r.creditsUnit, 0)
      }
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // AUTO PREDICT MISSING SCORES - COMPREHENSIVE VERSION
  // ────────────────────────────────────────────────────────────────────────────
  async autoPredictMissingScores(userId: number) {
    console.log(`🔍 Starting auto prediction for user ${userId}`);
    
    // Bước 1: Đảm bảo đã fill missing values trước
    console.log(`📊 Ensuring missing values are filled first...`);
    await this.fillMissingValuesWithMedian(userId);
    
    // Bước 2: Lấy tất cả records chưa có rawScore nhưng đã có đầy đủ features
    const recordsNeedPrediction = await this.prisma.scoreRecord.findMany({
      where: { 
        userId,
        rawScore: null,  // Chưa có điểm thực tế
        weeklyStudyHours: { not: null },
        attendancePercentage: { not: null },
        partTimeHours: { not: null },
        familySupport: { not: null }
      },
      include: { predictedScores: true }
    });

    console.log(`🔍 Found ${recordsNeedPrediction.length} records ready for prediction`);

    let predictedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const results: Array<{ courseCode: string; semester: string; predictedScore: number; isNew: boolean }> = [];

    for (const record of recordsNeedPrediction) {
      try {
        // Tính interaction features
        const sxa = record.weeklyStudyHours! * (record.attendancePercentage! / 100);
        const sxp = record.weeklyStudyHours! * (record.partTimeHours || 0);
        const fxp = (record.familySupport || 0) * (record.partTimeHours || 0);
        const axs = (record.attendancePercentage! / 100) * (record.familySupport || 0);
        const full = record.weeklyStudyHours! * (record.attendancePercentage! / 100) * (record.partTimeHours || 0) * (record.familySupport || 0);

        // Gọi ML service để predict
        const { data } = await axios.post('http://localhost:8000/predict', {
          semester_number: record.semesterNumber,
          course_code: record.courseCode,
          study_format: record.studyFormat,
          credits_unit: record.creditsUnit,
          weekly_study_hours: record.weeklyStudyHours,
          attendance_percentage: record.attendancePercentage,
          part_time_hours: record.partTimeHours,
          family_support: record.familySupport,
          study_hours_x_attendance: sxa,
          study_hours_x_part_part_time_hours: sxp,
          family_support_x_part_time_hours: fxp,
          attendance_x_support: axs,
          full_interaction_feature: full,
        });

        let isNew = false;

        // Kiểm tra xem đã có prediction chưa
        if (record.predictedScores.length > 0) {
          // Cập nhật prediction hiện có
          await this.prisma.predictedScore.update({
            where: { id: record.predictedScores[0].id },
            data: {
              predictedScore: data.predicted_score,
              convertedNumericScore: this.convertRawScoreToGPA(data.predicted_score),
              convertedScore: this.convertRawScoreToLetterGrade(data.predicted_score),
              mode: 'AUTO_PREDICT_UPDATED',
              updatedAt: new Date(),
            },
          });
          updatedCount++;
          console.log(`🔄 Updated ${record.courseCode}: ${data.predicted_score.toFixed(2)}`);
        } else {
          // Tạo prediction mới
          await this.prisma.predictedScore.create({
            data: {
              semesterNumber: record.semesterNumber,
              year: record.year,
              courseCode: record.courseCode,
              creditsUnit: record.creditsUnit,
              predictedScore: data.predicted_score,
              convertedNumericScore: this.convertRawScoreToGPA(data.predicted_score),
              convertedScore: this.convertRawScoreToLetterGrade(data.predicted_score),
              mode: 'AUTO_PREDICT',
              scoreRecord: { connect: { id: record.id } },
            },
          });
          predictedCount++;
          isNew = true;
          console.log(`✅ Predicted ${record.courseCode}: ${data.predicted_score.toFixed(2)}`);
        }

        results.push({
          courseCode: record.courseCode,
          semester: `HK${record.semesterNumber}-${record.year}`,
          predictedScore: data.predicted_score,
          isNew
        });

      } catch (error) {
        console.warn(`❌ Prediction failed for ${record.courseCode}:`, error.message);
        skippedCount++;
      }
    }

    // Bước 3: Kiểm tra các môn vẫn thiếu prediction
    const stillMissingPredictions = await this.prisma.scoreRecord.findMany({
      where: {
        userId,
        rawScore: null,
        predictedScores: { none: {} }  // Không có prediction nào
      },
      select: { courseCode: true, semesterNumber: true, year: true }
    });

    console.log(`📈 Auto prediction summary:`);
    console.log(`- New predictions: ${predictedCount}`);
    console.log(`- Updated predictions: ${updatedCount}`);
    console.log(`- Failed predictions: ${skippedCount}`);
    console.log(`- Still missing predictions: ${stillMissingPredictions.length}`);

    return {
      message: `Auto prediction completed`,
      summary: {
        totalRecordsReady: recordsNeedPrediction.length,
        newPredictions: predictedCount,
        updatedPredictions: updatedCount,
        failedPredictions: skippedCount,
        stillMissingPredictions: stillMissingPredictions.length,
        results
      }
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // DEBUG: CHECK PREDICTION STATUS
  // ────────────────────────────────────────────────────────────────────────────
  async checkPredictionStatus(userId: number) {
    const allRecords = await this.prisma.scoreRecord.findMany({
      where: { userId },
      include: { predictedScores: true }
    });

    const withActualScore = allRecords.filter(r => r.rawScore !== null);
    const withoutActualScore = allRecords.filter(r => r.rawScore === null);
    const withPrediction = allRecords.filter(r => r.predictedScores.length > 0);
    const withoutPrediction = allRecords.filter(r => r.predictedScores.length === 0);
    const readyForPrediction = withoutActualScore.filter(r => 
      r.weeklyStudyHours !== null && 
      r.attendancePercentage !== null && 
      r.partTimeHours !== null && 
      r.familySupport !== null
    );
    const notReadyForPrediction = withoutActualScore.filter(r => 
      r.weeklyStudyHours === null || 
      r.attendancePercentage === null || 
      r.partTimeHours === null || 
      r.familySupport === null
    );

    return {
      summary: {
        totalRecords: allRecords.length,
        withActualScore: withActualScore.length,
        withoutActualScore: withoutActualScore.length,
        withPrediction: withPrediction.length,
        withoutPrediction: withoutPrediction.length,
        readyForPrediction: readyForPrediction.length,
        notReadyForPrediction: notReadyForPrediction.length,
      },
      details: {
        recordsWithoutPrediction: withoutPrediction.map(r => ({
          courseCode: r.courseCode,
          semester: `HK${r.semesterNumber}-${r.year}`,
          hasFeatures: {
            weeklyStudyHours: r.weeklyStudyHours !== null,
            attendancePercentage: r.attendancePercentage !== null,
            partTimeHours: r.partTimeHours !== null,
            familySupport: r.familySupport !== null
          }
        })),
        readyButNotPredicted: readyForPrediction
          .filter(r => r.predictedScores.length === 0)
          .map(r => ({
            courseCode: r.courseCode,
            semester: `HK${r.semesterNumber}-${r.year}`
          }))
      }
    };
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
      orderBy: [
        { year: 'asc' },
        { semesterNumber: 'asc' }
      ]
    });

    // Get GPA statistics
    const gpaStats = await this.getGPAStats(userId);

    const chartData = records.map((record) => ({
      courseCode: record.courseCode,
      semester: `HK${record.semesterNumber}-${record.year}`,
      semesterNumber: record.semesterNumber,
      year: record.year,
      studyFormat: record.studyFormat,
      creditsUnit: record.creditsUnit,
      actual: record.rawScore,
      predicted: record.predictedScores[0]?.predictedScore ?? null,
      actualGPA: record.rawScore ? this.convertRawScoreToGPA(record.rawScore) : null,
      predictedGPA: record.predictedScores[0]?.predictedScore 
        ? this.convertRawScoreToGPA(record.predictedScores[0].predictedScore) 
        : null,
      // Add stored GPA values from import
      currentSemesterGpa: record.currentSemesterGpa,
      cumulativeGpa: record.cumulativeGpa,
      previousCoursesTaken: record.previousCoursesTaken,
      previousCreditsEarned: record.previousCreditsEarned,
    }));

    return {
      chartData,
      gpaStats
    };
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
        convertedNumericScore: this.convertRawScoreToGPA(predictedScore),
        convertedScore: this.convertRawScoreToLetterGrade(predictedScore),
        semesterNumber,
        year,
        courseCode,
        creditsUnit,
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

  // NEW METHOD: Add course without actual score (for future prediction)
  async addCourseForPrediction(courseData: {
    userId: number;
    semesterNumber: number;
    year: string;
    courseCode: string;
    studyFormat: string;
    creditsUnit: number;
    weeklyStudyHours?: number;
    attendancePercentage?: number;
    partTimeHours?: number;
    familySupport?: number;
  }) {
    const {
      userId, semesterNumber, year, courseCode, studyFormat, creditsUnit,
      weeklyStudyHours, attendancePercentage, partTimeHours, familySupport
    } = courseData;

    // Check if course already exists
    const existing = await this.prisma.scoreRecord.findFirst({
      where: { userId, semesterNumber, year, courseCode, studyFormat }
    });

    if (existing) {
      throw new Error(`Course ${courseCode} already exists for semester ${semesterNumber}-${year}`);
    }

    // Create course record without rawScore (null)
    const scoreRecord = await this.prisma.scoreRecord.create({
      data: {
        userId,
        semesterNumber,
        year,
        courseCode,
        studyFormat,
        creditsUnit,
        rawScore: null, // This is the key - no actual score yet
        weeklyStudyHours,
        attendancePercentage,
        partTimeHours,
        familySupport,
        // Calculate interaction features if enough data
        studyHoursXAttendance: weeklyStudyHours && attendancePercentage 
          ? weeklyStudyHours * (attendancePercentage / 100) : null,
        studyHoursXPartPartTimeHours: weeklyStudyHours && partTimeHours 
          ? weeklyStudyHours * partTimeHours : null,
        familySupportXPartTimeHours: familySupport && partTimeHours 
          ? familySupport * partTimeHours : null,
        attendanceXSupport: attendancePercentage && familySupport 
          ? (attendancePercentage / 100) * familySupport : null,
        fullInteractionFeature: weeklyStudyHours && attendancePercentage && partTimeHours && familySupport
          ? weeklyStudyHours * (attendancePercentage / 100) * partTimeHours * familySupport : null,
      }
    });

    return {
      success: true,
      scoreRecord,
      message: `Course ${courseCode} added successfully for prediction`
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SCORE CONVERSION HELPERS
  // ────────────────────────────────────────────────────────────────────────────
  
  // Convert raw score (0-10) to GPA (4.0 scale) based on official grading scale
  private convertRawScoreToGPA(rawScore: number): number {
    if (rawScore >= 9.5) return 4.0;   // A+
    if (rawScore >= 8.5) return 4.0;   // A
    if (rawScore >= 8.0) return 3.65;  // A-
    if (rawScore >= 7.5) return 3.33;  // B+
    if (rawScore >= 7.0) return 3.0;   // B
    if (rawScore >= 6.5) return 2.65;  // B-
    if (rawScore >= 6.0) return 2.33;  // C+
    if (rawScore >= 5.5) return 2.0;   // C
    if (rawScore >= 4.5) return 1.65;  // C-
    if (rawScore >= 4.0) return 1.0;   // D
    return 0.0;                        // F
  }

  // Convert raw score (0-10) to letter grade
  private convertRawScoreToLetterGrade(rawScore: number): string {
    if (rawScore >= 9.5) return 'A+';
    if (rawScore >= 8.5) return 'A';
    if (rawScore >= 8.0) return 'A-';
    if (rawScore >= 7.5) return 'B+';
    if (rawScore >= 7.0) return 'B';
    if (rawScore >= 6.5) return 'B-';
    if (rawScore >= 6.0) return 'C+';
    if (rawScore >= 5.5) return 'C';
    if (rawScore >= 4.5) return 'C-';
    if (rawScore >= 4.0) return 'D';
    return 'F';
  }

  // Get grade classification
  private getGradeClassification(rawScore: number): string {
    if (rawScore >= 9.5) return 'Giỏi';
    if (rawScore >= 8.5) return 'Giỏi';
    if (rawScore >= 7.5) return 'Khá';
    if (rawScore >= 6.0) return 'Trung bình';
    if (rawScore >= 4.5) return 'Trung bình yếu';
    if (rawScore >= 4.0) return 'Không đạt';
    return 'Kém';
  }

  // Get pass status
  private getPassStatus(rawScore: number): string {
    if (rawScore >= 4.5) return 'Đạt';
    if (rawScore >= 4.0) return 'Có điều kiện';
    return 'Không đạt';
  }

  private calculateWeightedGPA(scores: Array<{ convertedNumericScore: number; creditsUnit: number; courseCode?: string }>): number {
    //console.log(`DEBUG calculateWeightedGPA: Input scores length: ${scores.length}`);
    
    // Filter out courses starting with "ES"
    const filteredScores = scores.filter(score => 
      !score.courseCode || !score.courseCode.startsWith('ES')
    );
    //console.log(`DEBUG calculateWeightedGPA: Filtered scores length (excluding ES courses): ${filteredScores.length}`);
    
    const totalCredits = filteredScores.reduce((sum, score) => sum + score.creditsUnit, 0);
    //console.log(`DEBUG calculateWeightedGPA: Total credits (excluding ES): ${totalCredits}`);
    
    if (totalCredits === 0) return 0;

    const totalGradePoints = filteredScores.reduce((sum, score) => {
      const gpa = score.convertedNumericScore; // Sử dụng convertedNumericScore trực tiếp
      // console.log(`DEBUG: Converted numeric score ${score.convertedNumericScore} -> GPA ${gpa} (${score.creditsUnit} credits) - Course: ${score.courseCode || 'N/A'}`);
      return sum + (gpa * score.creditsUnit);
    }, 0);

    //console.log(`DEBUG calculateWeightedGPA: Total grade points: ${totalGradePoints}`);
    const finalGPA = totalGradePoints / totalCredits;
    //console.log(`DEBUG calculateWeightedGPA: Final GPA: ${finalGPA}`);

    return finalGPA;
  }

  async getGPAStats(userId: number) {
    // Get ALL records for this user, not just those with actual scores
    const allRecords = await this.prisma.scoreRecord.findMany({
      where: { userId },
      include: { predictedScores: true },
      orderBy: [
        { year: 'asc' },
        { semesterNumber: 'asc' }
      ]
    });

    //console.log(`DEBUG: Total records found: ${allRecords.length}`);
    
    // Log records with null rawScore
    const recordsWithoutScore = allRecords.filter(record => record.rawScore === null);
    //console.log(`DEBUG: Records without rawScore: ${recordsWithoutScore.length}`);
    // if (recordsWithoutScore.length > 0) {
    //   console.log(`DEBUG: Sample records without score:`, recordsWithoutScore.slice(0, 3).map(r => ({
    //     courseCode: r.courseCode,
    //     semester: `HK${r.semesterNumber}-${r.year}`,
    //     creditsUnit: r.creditsUnit,
    //     rawScore: r.rawScore
    //   })));
    // }
    
    // Calculate cumulative GPA from actual scores only (excluding ES courses)
    const actualScores = allRecords
      .filter(record => record.convertedNumericScore !== null && !record.courseCode.startsWith('ES'))
      .map(record => ({
        convertedNumericScore: record.convertedNumericScore!,
        creditsUnit: record.creditsUnit,
        courseCode: record.courseCode
      }));

    // console.log(`DEBUG: Actual scores count (excluding ES): ${actualScores.length}`);
    // console.log(`DEBUG: Total actual credits (excluding ES): ${actualScores.reduce((sum, s) => sum + s.creditsUnit, 0)}`);
    // console.log(`DEBUG: Sample actual scores:`, actualScores.slice(0, 5));

    const cumulativeGPA = this.calculateWeightedGPA(actualScores);

    // Calculate predicted GPA from ALL courses that have predictions (excluding ES courses)
    const predictedScores = allRecords
      .filter(record => 
        record.predictedScores.length > 0 && 
        record.predictedScores[0].predictedScore !== null &&
        !record.courseCode.startsWith('ES')
      )
      .map(record => ({
        convertedNumericScore: this.convertRawScoreToGPA(record.predictedScores[0].predictedScore!),
        creditsUnit: record.creditsUnit,
        courseCode: record.courseCode
      }));

    const predictedGPA = this.calculateWeightedGPA(predictedScores);

    // Calculate "projected" GPA: actual scores + predicted scores for courses without actual scores (excluding ES)
    const projectedScores: Array<{ convertedNumericScore: number; creditsUnit: number; courseCode: string }> = [];
    
    allRecords.forEach(record => {
      // Skip ES courses
      if (record.courseCode.startsWith('ES')) return;
      
      if (record.convertedNumericScore !== null) {
        // Use actual convertedNumericScore if available
        projectedScores.push({
          convertedNumericScore: record.convertedNumericScore,
          creditsUnit: record.creditsUnit,
          courseCode: record.courseCode
        });
      } else if (record.predictedScores.length > 0 && record.predictedScores[0].predictedScore !== null) {
        // Convert predicted score to GPA format if no actual converted score
        projectedScores.push({
          convertedNumericScore: this.convertRawScoreToGPA(record.predictedScores[0].predictedScore),
          creditsUnit: record.creditsUnit,
          courseCode: record.courseCode
        });
      }
    });

    const projectedGPA = this.calculateWeightedGPA(projectedScores);

    // Semester-wise GPA
    const semesterGPAs: Array<{
      semester: string;
      actualGPA: number;
      predictedGPA: number;
      projectedGPA: number;
      completedCredits: number;
      totalCredits: number;
      predictedCredits: number;
    }> = [];

    const semesterGroups = allRecords.reduce((groups, record) => {
      const semesterKey = `HK${record.semesterNumber}-${record.year}`;
      if (!groups[semesterKey]) groups[semesterKey] = [];
      groups[semesterKey].push(record);
      return groups;
    }, {} as Record<string, typeof allRecords>);

    Object.entries(semesterGroups).forEach(([semester, records]) => {
      const actualRecords = records.filter(r => r.convertedNumericScore !== null && !r.courseCode.startsWith('ES'));
      const predictedRecords = records.filter(r => 
        r.predictedScores.length > 0 && 
        r.predictedScores[0].predictedScore !== null &&
        !r.courseCode.startsWith('ES')
      );
      
      // Combined records for projected GPA (excluding ES courses)
      const combinedRecords: Array<{ convertedNumericScore: number; creditsUnit: number; courseCode: string }> = [];
      records.forEach(record => {
        if (record.courseCode.startsWith('ES')) return; // Skip ES courses
        
        if (record.convertedNumericScore !== null) {
          combinedRecords.push({ 
            convertedNumericScore: record.convertedNumericScore, 
            creditsUnit: record.creditsUnit,
            courseCode: record.courseCode
          });
        } else if (record.predictedScores.length > 0 && record.predictedScores[0].predictedScore !== null) {
          combinedRecords.push({ 
            convertedNumericScore: this.convertRawScoreToGPA(record.predictedScores[0].predictedScore), 
            creditsUnit: record.creditsUnit,
            courseCode: record.courseCode
          });
        }
      });
      
      const actualGPA = actualRecords.length > 0 
        ? this.calculateWeightedGPA(actualRecords.map(r => ({ 
            convertedNumericScore: r.convertedNumericScore!, 
            creditsUnit: r.creditsUnit,
            courseCode: r.courseCode
          })))
        : 0;
        
      const predictedGPA = predictedRecords.length > 0
        ? this.calculateWeightedGPA(predictedRecords.map(r => ({ 
            convertedNumericScore: this.convertRawScoreToGPA(r.predictedScores[0].predictedScore!), 
            creditsUnit: r.creditsUnit,
            courseCode: r.courseCode
          })))
        : 0;

      const projectedGPA = combinedRecords.length > 0
        ? this.calculateWeightedGPA(combinedRecords)
        : 0;

      const completedCredits = actualRecords.reduce((sum, r) => sum + r.creditsUnit, 0);
      const totalCredits = records.filter(r => !r.courseCode.startsWith('ES')).reduce((sum, r) => sum + r.creditsUnit, 0);
      const predictedCredits = predictedRecords.reduce((sum, r) => sum + r.creditsUnit, 0);

      semesterGPAs.push({
        semester,
        actualGPA,
        predictedGPA,
        projectedGPA,
        completedCredits,
        totalCredits,
        predictedCredits
      });
    });

    // console.log(`DEBUG getGPAStats final result:`, {
    //   totalCompletedCredits: actualScores.reduce((sum, s) => sum + s.creditsUnit, 0),
    //   totalCredits: allRecords.filter(r => !r.courseCode.startsWith('ES')).reduce((sum, r) => sum + r.creditsUnit, 0),
    //   completedCourses: actualScores.length,
    //   totalCourses: allRecords.filter(r => !r.courseCode.startsWith('ES')).length,
    //   recordsWithoutScore: allRecords.filter(r => r.convertedNumericScore === null && !r.courseCode.startsWith('ES')).length
    // });

    return {
      cumulativeGPA,        // GPA từ convertedNumericScore đã có (excluding ES)
      predictedGPA,         // GPA từ tất cả dự đoán (excluding ES)
      projectedGPA,         // GPA kết hợp (thực tế + dự đoán cho môn thiếu, excluding ES)
      totalCompletedCredits: actualScores.reduce((sum, s) => sum + s.creditsUnit, 0),
      totalCredits: allRecords.filter(r => !r.courseCode.startsWith('ES')).reduce((sum, r) => sum + r.creditsUnit, 0),
      totalPredictedCredits: predictedScores.reduce((sum, s) => sum + s.creditsUnit, 0),
      semesterGPAs,
      totalCourses: allRecords.filter(r => !r.courseCode.startsWith('ES')).length,
      completedCourses: actualScores.length,
      predictedCourses: predictedScores.length
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // CALCULATE PREDICTED GPA FROM PREDICTED_SCORE TABLE
  // ────────────────────────────────────────────────────────────────────────────
  async getPredictedGPAStats(userId: number) {
    console.log(`🎯 Calculating predicted GPA for user ${userId}`);
    
    // Lấy tất cả PredictedScore có convertedNumericScore
    const predictedScores = await this.prisma.predictedScore.findMany({
      where: {
        scoreRecord: { userId },
        convertedNumericScore: { not: null },
        courseCode: { not: { startsWith: 'ES' } } // Loại trừ môn ES
      },
      include: {
        scoreRecord: {
          select: {
            courseCode: true,
            semesterNumber: true,
            year: true
          }
        }
      },
      orderBy: [
        { year: 'asc' },
        { semesterNumber: 'asc' }
      ]
    });

    console.log(`📊 Found ${predictedScores.length} predicted scores with converted values`);

    if (predictedScores.length === 0) {
      return {
        predictedGPA: null,
        totalPredictedCredits: 0,
        totalPredictedCourses: 0,
        message: 'No predicted scores with converted values found'
      };
    }

    // Tính GPA dự đoán theo công thức: Σ(convertedNumericScore * creditsUnit) / Σ(creditsUnit)
    const scoresForGPA = predictedScores.map(ps => ({
      convertedNumericScore: ps.convertedNumericScore!,
      creditsUnit: ps.creditsUnit,
      courseCode: ps.courseCode
    }));

    const predictedGPA = this.calculateWeightedGPA(scoresForGPA);
    const totalPredictedCredits = predictedScores.reduce((sum, ps) => sum + ps.creditsUnit, 0);

    // Thống kê theo học kỳ
    const semesterStats: Array<{
      semester: string;
      gpa: number;
      credits: number;
      courses: number;
    }> = [];

    const groupedBySemester = predictedScores.reduce((acc, ps) => {
      const semesterKey = `HK${ps.semesterNumber}-${ps.year}`;
      if (!acc[semesterKey]) {
        acc[semesterKey] = [];
      }
      acc[semesterKey].push(ps);
      return acc;
    }, {} as Record<string, typeof predictedScores>);

    Object.entries(groupedBySemester).forEach(([semester, scores]) => {
      const semesterScoresForGPA = scores.map(ps => ({
        convertedNumericScore: ps.convertedNumericScore!,
        creditsUnit: ps.creditsUnit,
        courseCode: ps.courseCode
      }));
      
      const semesterGPA = this.calculateWeightedGPA(semesterScoresForGPA);
      const semesterCredits = scores.reduce((sum, ps) => sum + ps.creditsUnit, 0);
      
      semesterStats.push({
        semester,
        gpa: semesterGPA,
        credits: semesterCredits,
        courses: scores.length
      });
    });

    console.log(`🎯 Predicted GPA calculated: ${predictedGPA} from ${totalPredictedCredits} credits`);

    return {
      predictedGPA,
      totalPredictedCredits,
      totalPredictedCourses: predictedScores.length,
      semesterStats: semesterStats.sort((a, b) => a.semester.localeCompare(b.semester)),
      details: {
        averageCreditsPerCourse: Math.round((totalPredictedCredits / predictedScores.length) * 100) / 100,
        coursesWithPredictions: predictedScores.map(ps => ({
          courseCode: ps.courseCode,
          semester: `HK${ps.semesterNumber}-${ps.year}`,
          predictedScore: ps.predictedScore,
          convertedScore: ps.convertedScore,
          convertedNumericScore: ps.convertedNumericScore,
          creditsUnit: ps.creditsUnit
        }))
      }
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // FILL MISSING VALUES WITH MEDIAN BY SUBJECT TYPE
  // ────────────────────────────────────────────────────────────────────────────
  async fillMissingValuesWithMedian(userId: number) {
    // Lấy tất cả records của user
    const allRecords = await this.prisma.scoreRecord.findMany({
      where: { userId },
    });

    if (allRecords.length === 0) {
      return { message: 'No records found for this user' };
    }

    // Helper function để tính median
    const calculateMedian = (values: number[]): number => {
      if (values.length === 0) return 0;
      const sorted = values.sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 
        ? sorted[mid] 
        : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    // Helper function để lấy median values cho một subject type cụ thể
    const getMedianValuesBySubjectType = (subjectType: 'major' | 'general') => {
      const recordsOfType = allRecords.filter(r => {
        const recordSubjectType = SUBJECT_TYPE_MAP[r.courseCode] || 'general';
        return recordSubjectType === subjectType;
      });

      return {
        weeklyStudyHours: calculateMedian(
          recordsOfType.filter(r => r.weeklyStudyHours !== null).map(r => r.weeklyStudyHours!)
        ),
        attendancePercentage: calculateMedian(
          recordsOfType.filter(r => r.attendancePercentage !== null).map(r => r.attendancePercentage!)
        ),
        partTimeHours: calculateMedian(
          recordsOfType.filter(r => r.partTimeHours !== null).map(r => r.partTimeHours!)
        ),
        familySupport: calculateMedian(
          recordsOfType.filter(r => r.familySupport !== null).map(r => r.familySupport!)
        ),
      };
    };

    // Tính median cho từng subject type
    const majorMedians = getMedianValuesBySubjectType('major');
    const generalMedians = getMedianValuesBySubjectType('general');

    // Tính median tổng thể cho fallback (từ tất cả records)
    const overallMedians = {
      weeklyStudyHours: calculateMedian(
        allRecords.filter(r => r.weeklyStudyHours !== null).map(r => r.weeklyStudyHours!)
      ),
      attendancePercentage: calculateMedian(
        allRecords.filter(r => r.attendancePercentage !== null).map(r => r.attendancePercentage!)
      ),
      partTimeHours: calculateMedian(
        allRecords.filter(r => r.partTimeHours !== null).map(r => r.partTimeHours!)
      ),
      familySupport: calculateMedian(
        allRecords.filter(r => r.familySupport !== null).map(r => r.familySupport!)
      ),
    };

    // Fallback values - sử dụng median tổng thể hoặc giá trị mặc định
    const defaultValues = {
      weeklyStudyHours: 12,
      attendancePercentage: 85,
      partTimeHours: 0,
      familySupport: 3
    };

    let updatedCount = 0;

    // Cập nhật các records chưa có rawScore
    for (const record of allRecords) {
      if (record.rawScore === null) {
        const subjectType = SUBJECT_TYPE_MAP[record.courseCode] || 'general';
        const currentMedians = subjectType === 'major' ? majorMedians : generalMedians;
        
        const updateData: any = {};
        let needsUpdate = false;

        // Helper function để lấy giá trị median với fallback
        const getMedianValue = (feature: keyof typeof currentMedians) => {
          return currentMedians[feature] || 
                 overallMedians[feature] || 
                 defaultValues[feature];
        };

        // Cập nhật weeklyStudyHours nếu null
        if (record.weeklyStudyHours === null) {
          updateData.weeklyStudyHours = getMedianValue('weeklyStudyHours');
          needsUpdate = true;
        }

        // Cập nhật attendancePercentage nếu null
        if (record.attendancePercentage === null) {
          updateData.attendancePercentage = getMedianValue('attendancePercentage');
          needsUpdate = true;
        }

        // Cập nhật partTimeHours nếu null
        if (record.partTimeHours === null) {
          updateData.partTimeHours = getMedianValue('partTimeHours');
          needsUpdate = true;
        }

        // Cập nhật familySupport nếu null
        if (record.familySupport === null) {
          updateData.familySupport = getMedianValue('familySupport');
          needsUpdate = true;
        }

        if (needsUpdate) {
          // Tính lại interaction features
          const weeklyStudyHours = updateData.weeklyStudyHours || record.weeklyStudyHours;
          const attendancePercentage = updateData.attendancePercentage || record.attendancePercentage;
          const familySupport = updateData.familySupport || record.familySupport;
          const partTimeHours = updateData.partTimeHours || record.partTimeHours || 0;

          updateData.studyHoursXAttendance = weeklyStudyHours * (attendancePercentage / 100);
          updateData.attendanceXSupport = (attendancePercentage / 100) * familySupport;
          updateData.familySupportXPartTimeHours = familySupport * partTimeHours;
          updateData.studyHoursXPartPartTimeHours = weeklyStudyHours * partTimeHours;
          updateData.fullInteractionFeature = weeklyStudyHours * (attendancePercentage / 100) * partTimeHours * familySupport;

          await this.prisma.scoreRecord.update({
            where: { id: record.id },
            data: updateData,
          });

          updatedCount++;
        }
      }
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // AUTO PREDICT AFTER FILLING MISSING VALUES
    // ──────────────────────────────────────────────────────────────────────────────
    console.log(`🔄 Starting auto prediction after filling missing values...`);
    
    // Lấy lại tất cả records sau khi đã update (để có data mới nhất)
    const updatedRecords = await this.prisma.scoreRecord.findMany({
      where: { userId },
      include: { predictedScores: true }
    });

    // Lọc ra các records chưa có rawScore nhưng đã có đầy đủ features
    const recordsReadyForPrediction = updatedRecords.filter(record => 
      record.rawScore === null &&
      record.weeklyStudyHours !== null &&
      record.attendancePercentage !== null &&
      record.partTimeHours !== null &&
      record.familySupport !== null
    );

    console.log(`📊 Found ${recordsReadyForPrediction.length} records ready for auto prediction`);

    let newPredictions = 0;
    let updatedPredictions = 0;
    let failedPredictions = 0;
    const predictionResults: Array<{ courseCode: string; semester: string; predictedScore: number; isNew: boolean }> = [];

    for (const record of recordsReadyForPrediction) {
      try {
        // Tính interaction features
        const sxa = record.weeklyStudyHours! * (record.attendancePercentage! / 100);
        const sxp = record.weeklyStudyHours! * (record.partTimeHours || 0);
        const fxp = (record.familySupport || 0) * (record.partTimeHours || 0);
        const axs = (record.attendancePercentage! / 100) * (record.familySupport || 0);
        const full = record.weeklyStudyHours! * (record.attendancePercentage! / 100) * (record.partTimeHours || 0) * (record.familySupport || 0);

        // Gọi ML service để predict
        const { data } = await axios.post('http://localhost:8000/predict', {
          semester_number: record.semesterNumber,
          course_code: record.courseCode,
          study_format: record.studyFormat,
          credits_unit: record.creditsUnit,
          weekly_study_hours: record.weeklyStudyHours,
          attendance_percentage: record.attendancePercentage,
          part_time_hours: record.partTimeHours,
          family_support: record.familySupport,
          study_hours_x_attendance: sxa,
          study_hours_x_part_part_time_hours: sxp,
          family_support_x_part_time_hours: fxp,
          attendance_x_support: axs,
          full_interaction_feature: full,
        });

        let isNew = false;

        // Kiểm tra xem đã có prediction chưa
        if (record.predictedScores.length > 0) {
          // Cập nhật prediction hiện có
          await this.prisma.predictedScore.update({
            where: { id: record.predictedScores[0].id },
            data: {
              predictedScore: data.predicted_score,
              convertedNumericScore: this.convertRawScoreToGPA(data.predicted_score),
              convertedScore: this.convertRawScoreToLetterGrade(data.predicted_score),
              mode: 'AUTO_PREDICT_AFTER_FILL',
              updatedAt: new Date(),
            },
          });
          updatedPredictions++;
          console.log(`🔄 Updated prediction for ${record.courseCode}: ${data.predicted_score.toFixed(2)}`);
        } else {
          // Tạo prediction mới
          await this.prisma.predictedScore.create({
            data: {
              semesterNumber: record.semesterNumber,
              year: record.year,
              courseCode: record.courseCode,
              creditsUnit: record.creditsUnit,
              predictedScore: data.predicted_score,
              convertedNumericScore: this.convertRawScoreToGPA(data.predicted_score),
              convertedScore: this.convertRawScoreToLetterGrade(data.predicted_score),
              mode: 'AUTO_PREDICT_AFTER_FILL',
              scoreRecord: { connect: { id: record.id } },
            },
          });
          newPredictions++;
          isNew = true;
          console.log(`✅ New prediction for ${record.courseCode}: ${data.predicted_score.toFixed(2)}`);
        }

        predictionResults.push({
          courseCode: record.courseCode,
          semester: `HK${record.semesterNumber}-${record.year}`,
          predictedScore: data.predicted_score,
          isNew
        });

      } catch (error) {
        console.warn(`❌ Prediction failed for ${record.courseCode}:`, error.message);
        failedPredictions++;
      }
    }

    console.log(`📈 Auto prediction completed: ${newPredictions} new, ${updatedPredictions} updated, ${failedPredictions} failed`);

    return {
      message: `Successfully updated ${updatedCount} records with missing values and completed ${newPredictions + updatedPredictions} predictions`,
      fillMissingValues: {
        updatedRecords: updatedCount,
        medianValues: {
          major: majorMedians,
          general: generalMedians,
          overall: overallMedians
        },
        dataAvailability: {
          majorRecords: allRecords.filter(r => SUBJECT_TYPE_MAP[r.courseCode] === 'major').length,
          generalRecords: allRecords.filter(r => (SUBJECT_TYPE_MAP[r.courseCode] || 'general') === 'general').length,
          totalRecordsWithData: allRecords.filter(r => 
            r.weeklyStudyHours !== null || 
            r.attendancePercentage !== null || 
            r.partTimeHours !== null || 
            r.familySupport !== null
          ).length
        }
      },
      autoPrediction: {
        totalRecordsReady: recordsReadyForPrediction.length,
        newPredictions,
        updatedPredictions,
        failedPredictions,
        predictionResults
      }
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // TEST DATA: ADD COURSES WITHOUT SCORES FOR PREDICTION TESTING
  // ────────────────────────────────────────────────────────────────────────────
  async addTestCoursesForPrediction(userId: number) {
    const testCourses = [
      {
        semesterNumber: 4,
        year: '2023-2024',
        courseCode: 'CMU-CS-445',
        studyFormat: 'LEC',
        creditsUnit: 3,
      },
      {
        semesterNumber: 4,
        year: '2023-2024',
        courseCode: 'CMU-CS-447',
        studyFormat: 'LEC',
        creditsUnit: 3,
      },
      {
        semesterNumber: 4,
        year: '2023-2024',
        courseCode: 'CMU-CS-462',
        studyFormat: 'LEC',
        creditsUnit: 3,
      },
      {
        semesterNumber: 5,
        year: '2023-2024',
        courseCode: 'CMU-SE-450',
        studyFormat: 'LEC',
        creditsUnit: 3,
      },
      {
        semesterNumber: 5,
        year: '2023-2024',
        courseCode: 'CMU-SE-403',
        studyFormat: 'LEC',
        creditsUnit: 3,
      },
      {
        semesterNumber: 5,
        year: '2023-2024',
        courseCode: 'LAW-201',
        studyFormat: 'LEC',
        creditsUnit: 2,
      }
    ];

    const addedCourses: any[] = [];
    const skippedCourses: any[] = [];

    for (const course of testCourses) {
      try {
        const result = await this.addCourseForPrediction({
          userId,
          ...course,
          // Không set features - sẽ được fill bằng median sau
        });
        addedCourses.push({
          courseCode: course.courseCode,
          semester: `HK${course.semesterNumber}-${course.year}`,
          creditsUnit: course.creditsUnit
        });
      } catch (error) {
        skippedCourses.push({
          courseCode: course.courseCode,
          semester: `HK${course.semesterNumber}-${course.year}`,
          error: error.message
        });
      }
    }

    console.log(`🎓 Test courses added: ${addedCourses.length}, skipped: ${skippedCourses.length}`);

    return {
      message: `Added ${addedCourses.length} test courses for prediction`,
      addedCourses,
      skippedCourses,
      nextSteps: [
        "1. Call fillMissingValuesWithMedian() to fill features with median values",
        "2. The method will automatically predict scores for these courses",
        "3. Check the predictions in PredictedScore table"
      ]
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // UPDATE PREDICTED SCORE CONVERSIONS
  // ────────────────────────────────────────────────────────────────────────────
  async updatePredictedScoreConversions(userId: number) {
    console.log(`🔄 Starting conversion update for predicted scores of user ${userId}`);

    // Lấy tất cả predicted scores của user có predictedScore không null
    const predictedScores = await this.prisma.predictedScore.findMany({
      where: {
        scoreRecord: { userId },
        predictedScore: { not: null }
      },
      include: {
        scoreRecord: true
      }
    });

    console.log(`📊 Found ${predictedScores.length} predicted scores to update`);

    let updatedCount = 0;
    const conversionResults: Array<{
      courseCode: string;
      semester: string;
      predictedScore: number;
      convertedNumericScore: number;
      convertedScore: string;
      classification: string;
      status: string;
    }> = [];

    for (const prediction of predictedScores) {
      const rawScore = prediction.predictedScore!;
      const convertedNumericScore = this.convertRawScoreToGPA(rawScore);
      const convertedScore = this.convertRawScoreToLetterGrade(rawScore);
      const classification = this.getGradeClassification(rawScore);
      const status = this.getPassStatus(rawScore);

      try {
        // Cập nhật predicted score với converted values
        await this.prisma.predictedScore.update({
          where: { id: prediction.id },
          data: {
            convertedNumericScore,
            convertedScore,
          }
        });

        updatedCount++;
        
        conversionResults.push({
          courseCode: prediction.courseCode,
          semester: `HK${prediction.semesterNumber}-${prediction.year}`,
          predictedScore: rawScore,
          convertedNumericScore,
          convertedScore,
          classification,
          status
        });

        console.log(`✅ Updated ${prediction.courseCode}: ${rawScore.toFixed(2)} → ${convertedScore} (${convertedNumericScore})`);
      
      } catch (error) {
        console.warn(`❌ Failed to update ${prediction.courseCode}:`, error.message);
      }
    }

    // Tính thống kê tổng quan
    const totalPredicted = conversionResults.length;
    const passingCount = conversionResults.filter(r => r.status === 'Đạt').length;
    const conditionalCount = conversionResults.filter(r => r.status === 'Có điều kiện').length;
    const failingCount = conversionResults.filter(r => r.status === 'Không đạt').length;

    const gradeDistribution = {
      'A+': conversionResults.filter(r => r.convertedScore === 'A+').length,
      'A': conversionResults.filter(r => r.convertedScore === 'A').length,
      'A-': conversionResults.filter(r => r.convertedScore === 'A-').length,
      'B+': conversionResults.filter(r => r.convertedScore === 'B+').length,
      'B': conversionResults.filter(r => r.convertedScore === 'B').length,
      'B-': conversionResults.filter(r => r.convertedScore === 'B-').length,
      'C+': conversionResults.filter(r => r.convertedScore === 'C+').length,
      'C': conversionResults.filter(r => r.convertedScore === 'C').length,
      'C-': conversionResults.filter(r => r.convertedScore === 'C-').length,
      'D': conversionResults.filter(r => r.convertedScore === 'D').length,
      'F': conversionResults.filter(r => r.convertedScore === 'F').length,
    };

    console.log(`📈 Conversion completed: ${updatedCount} records updated`);

    return {
      message: `Successfully updated conversion for ${updatedCount} predicted scores`,
      summary: {
        totalProcessed: predictedScores.length,
        successfullyUpdated: updatedCount,
        failedUpdates: predictedScores.length - updatedCount,
        academicPerformance: {
          passing: passingCount,
          conditional: conditionalCount,
          failing: failingCount,
          passingRate: totalPredicted > 0 ? ((passingCount / totalPredicted) * 100).toFixed(2) + '%' : '0%'
        },
        gradeDistribution,
        averagePredictedGPA: totalPredicted > 0 
          ? (conversionResults.reduce((sum, r) => sum + r.convertedNumericScore, 0) / totalPredicted).toFixed(3)
          : '0.000'
      },
      detailedResults: conversionResults
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // UPDATE SCORE RECORD CONVERSIONS
  // ────────────────────────────────────────────────────────────────────────────
  async updateScoreRecordConversions(userId: number) {
    console.log(`🔄 Starting conversion update for actual scores of user ${userId}`);

    // Lấy tất cả score records của user có rawScore không null
    const scoreRecords = await this.prisma.scoreRecord.findMany({
      where: {
        userId,
        rawScore: { not: null }
      }
    });

    console.log(`📊 Found ${scoreRecords.length} actual scores to update`);

    let updatedCount = 0;
    const conversionResults: Array<{
      courseCode: string;
      semester: string;
      rawScore: number;
      convertedNumericScore: number;
      convertedScore: string;
      classification: string;
      status: string;
    }> = [];

    for (const record of scoreRecords) {
      const rawScore = record.rawScore!;
      const convertedNumericScore = this.convertRawScoreToGPA(rawScore);
      const convertedScore = this.convertRawScoreToLetterGrade(rawScore);
      const classification = this.getGradeClassification(rawScore);
      const status = this.getPassStatus(rawScore);

      try {
        // Cập nhật score record với converted values
        await this.prisma.scoreRecord.update({
          where: { id: record.id },
          data: {
            convertedNumericScore,
            convertedScore,
          }
        });

        updatedCount++;
        
        conversionResults.push({
          courseCode: record.courseCode,
          semester: `HK${record.semesterNumber}-${record.year}`,
          rawScore,
          convertedNumericScore,
          convertedScore,
          classification,
          status
        });

        console.log(`✅ Updated ${record.courseCode}: ${rawScore.toFixed(2)} → ${convertedScore} (${convertedNumericScore})`);
      
      } catch (error) {
        console.warn(`❌ Failed to update ${record.courseCode}:`, error.message);
      }
    }

    // Tính thống kê tổng quan
    const totalActual = conversionResults.length;
    const passingCount = conversionResults.filter(r => r.status === 'Đạt').length;
    const conditionalCount = conversionResults.filter(r => r.status === 'Có điều kiện').length;
    const failingCount = conversionResults.filter(r => r.status === 'Không đạt').length;

    const gradeDistribution = {
      'A+': conversionResults.filter(r => r.convertedScore === 'A+').length,
      'A': conversionResults.filter(r => r.convertedScore === 'A').length,
      'A-': conversionResults.filter(r => r.convertedScore === 'A-').length,
      'B+': conversionResults.filter(r => r.convertedScore === 'B+').length,
      'B': conversionResults.filter(r => r.convertedScore === 'B').length,
      'B-': conversionResults.filter(r => r.convertedScore === 'B-').length,
      'C+': conversionResults.filter(r => r.convertedScore === 'C+').length,
      'C': conversionResults.filter(r => r.convertedScore === 'C').length,
      'C-': conversionResults.filter(r => r.convertedScore === 'C-').length,
      'D': conversionResults.filter(r => r.convertedScore === 'D').length,
      'F': conversionResults.filter(r => r.convertedScore === 'F').length,
    };

    console.log(`📈 Actual scores conversion completed: ${updatedCount} records updated`);

    return {
      message: `Successfully updated conversion for ${updatedCount} actual scores`,
      summary: {
        totalProcessed: scoreRecords.length,
        successfullyUpdated: updatedCount,
        failedUpdates: scoreRecords.length - updatedCount,
        academicPerformance: {
          passing: passingCount,
          conditional: conditionalCount,
          failing: failingCount,
          passingRate: totalActual > 0 ? ((passingCount / totalActual) * 100).toFixed(2) + '%' : '0%'
        },
        gradeDistribution,
        averageActualGPA: totalActual > 0 
          ? (conversionResults.reduce((sum, r) => sum + r.convertedNumericScore, 0) / totalActual).toFixed(3)
          : '0.000'
      },
      detailedResults: conversionResults
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // UPDATE ALL CONVERSIONS (BOTH ACTUAL AND PREDICTED)
  // ────────────────────────────────────────────────────────────────────────────
  async updateAllScoreConversions(userId: number) {
    console.log(`🚀 Starting comprehensive score conversion update for user ${userId}`);

    // Cập nhật actual scores
    const actualResults = await this.updateScoreRecordConversions(userId);
    
    // Cập nhật predicted scores  
    const predictedResults = await this.updatePredictedScoreConversions(userId);

    // Tính GPA stats sau khi cập nhật
    const gpaStats = await this.getGPAStats(userId);

    console.log(`🎯 All conversions completed successfully`);

    return {
      message: `Successfully updated all score conversions for user ${userId}`,
      actualScoresUpdate: actualResults,
      predictedScoresUpdate: predictedResults,
      updatedGPAStats: gpaStats,
      summary: {
        totalActualScoresUpdated: actualResults.summary.successfullyUpdated,
        totalPredictedScoresUpdated: predictedResults.summary.successfullyUpdated,
        totalUpdated: actualResults.summary.successfullyUpdated + predictedResults.summary.successfullyUpdated,
        cumulativeGPA: gpaStats.cumulativeGPA,
        projectedGPA: gpaStats.projectedGPA
      }
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // DEBUG: ANALYZE DATA AVAILABILITY
  // ────────────────────────────────────────────────────────────────────────────
  async analyzeDataAvailability(userId: number) {
    const allRecords = await this.prisma.scoreRecord.findMany({
      where: { userId },
    });

    if (allRecords.length === 0) {
      return { message: 'No records found for this user' };
    }

    const majorRecords = allRecords.filter(r => SUBJECT_TYPE_MAP[r.courseCode] === 'major');
    const generalRecords = allRecords.filter(r => (SUBJECT_TYPE_MAP[r.courseCode] || 'general') === 'general');

    // Phân tích từng field
    const analyzeField = (records: typeof allRecords, fieldName: keyof typeof allRecords[0]) => {
      const withData = records.filter(r => r[fieldName] !== null);
      const values = withData.map(r => r[fieldName] as number).filter(v => v !== null);
      
      if (values.length === 0) return { count: 0, min: null, max: null, avg: null, median: null };
      
      const sorted = values.sort((a, b) => a - b);
      const median = sorted.length % 2 !== 0 
        ? sorted[Math.floor(sorted.length / 2)] 
        : (sorted[Math.floor(sorted.length / 2) - 1] + sorted[Math.floor(sorted.length / 2)]) / 2;

      return {
        count: withData.length,
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((sum, v) => sum + v, 0) / values.length,
        median
      };
    };

    return {
      summary: {
        totalRecords: allRecords.length,
        majorRecords: majorRecords.length,
        generalRecords: generalRecords.length,
        recordsWithoutRawScore: allRecords.filter(r => r.rawScore === null).length,
      },
      dataAnalysis: {
        all: {
          weeklyStudyHours: analyzeField(allRecords, 'weeklyStudyHours'),
          attendancePercentage: analyzeField(allRecords, 'attendancePercentage'),
          partTimeHours: analyzeField(allRecords, 'partTimeHours'),
          familySupport: analyzeField(allRecords, 'familySupport'),
        },
        major: {
          weeklyStudyHours: analyzeField(majorRecords, 'weeklyStudyHours'),
          attendancePercentage: analyzeField(majorRecords, 'attendancePercentage'),
          partTimeHours: analyzeField(majorRecords, 'partTimeHours'),
          familySupport: analyzeField(majorRecords, 'familySupport'),
        },
        general: {
          weeklyStudyHours: analyzeField(generalRecords, 'weeklyStudyHours'),
          attendancePercentage: analyzeField(generalRecords, 'attendancePercentage'),
          partTimeHours: analyzeField(generalRecords, 'partTimeHours'),
          familySupport: analyzeField(generalRecords, 'familySupport'),
        }
      }
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // GET LEARNING PATH DATA FOR A SPECIFIC COURSE
  // ────────────────────────────────────────────────────────────────────────────
  async getLearningPath(courseCode: string, userId: number) {
    try {
      // Get the specific course data (both actual and predicted)
      const scoreRecord = await this.prisma.scoreRecord.findFirst({
        where: { 
          userId, 
          courseCode 
        },
        include: {
          predictedScores: true
        }
      });

      const predictedScore = await this.prisma.predictedScore.findFirst({
        where: { 
          courseCode,
          scoreRecord: { userId }
        }
      });

      if (!scoreRecord && !predictedScore) {
        throw new Error(`Course ${courseCode} not found for user ${userId}`);
      }

      // Calculate user's average study patterns from all completed courses
      const completedCourses = await this.prisma.scoreRecord.findMany({
        where: { 
          userId,
          rawScore: { not: null }
        }
      });

      // Calculate averages from user's historical data
      const totalCourses = completedCourses.length;
      const avgWeeklyStudyHours = totalCourses > 0 
        ? completedCourses.reduce((sum, record) => sum + (record.weeklyStudyHours || 0), 0) / totalCourses 
        : 8; // Default fallback

      const avgAttendancePercentage = totalCourses > 0
        ? completedCourses.reduce((sum, record) => sum + (record.attendancePercentage || 0), 0) / totalCourses
        : 85; // Default fallback

      const avgCommuteTime = totalCourses > 0
        ? completedCourses.reduce((sum, record) => sum + (record.commuteTimeMinutes || 0), 0) / totalCourses
        : 30; // Default fallback

      // Get credit units for the course
      const creditUnits = scoreRecord?.creditsUnit || predictedScore?.creditsUnit || 3;
      
      // Calculate recommended study hours based on credits (general rule: 2-3 hours per credit per week)
      const recommendedWeeklyHours = creditUnits * 2.5;
      const semesterWeeks = 15; // Typical semester length
      const recommendedTotalHours = recommendedWeeklyHours * semesterWeeks;

      // Get predicted score
      const finalPredictedScore = predictedScore?.predictedScore || scoreRecord?.predictedScores?.[0]?.predictedScore || 0;

      return {
        courseCode,
        courseName: `${courseCode}: Introduction to Programming`, // You can enhance this with a course name mapping
        creditUnits,
        predictedScore: finalPredictedScore,
        currentStatus: {
          weeklyStudyTime: Math.round(avgWeeklyStudyHours * 10) / 10,
          attendancePercentage: Math.round(avgAttendancePercentage * 10) / 10,
          commuteTimeMinutes: Math.round(avgCommuteTime * 10) / 10,
          recommendedTotalHours: Math.round(recommendedTotalHours),
          currentTotalHours: Math.round(avgWeeklyStudyHours * semesterWeeks),
        },
        recommendations: {
          onTrack: finalPredictedScore >= 7.0,
          message: finalPredictedScore >= 7.0 
            ? "Your current study plan should help you achieve your predicted score. Stay consistent!"
            : "Consider increasing study time and attendance to improve your predicted score.",
          suggestedWeeklyHours: finalPredictedScore < 7.0 
            ? Math.ceil(recommendedWeeklyHours * 1.2) // Increase by 20% if below target
            : recommendedWeeklyHours
        },
        userProfile: {
          totalCompletedCourses: totalCourses,
          averagePerformance: totalCourses > 0 
            ? Math.round((completedCourses.reduce((sum, record) => sum + (record.rawScore || 0), 0) / totalCourses) * 10) / 10
            : 0,
          studyPatterns: {
            avgWeeklyStudyHours,
            avgAttendancePercentage,
            avgCommuteTime
          }
        }
      };
      
    } catch (error) {
      console.error('Error in getLearningPath:', error);
      throw new Error(`Failed to get learning path for course ${courseCode}: ${error.message}`);
    }
  }
}
