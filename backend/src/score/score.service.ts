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
        weeklyStudyHours: isNaN(weeklyStudyHours) ? null : weeklyStudyHours,
        attendancePercentage: isNaN(attendancePercentage) ? null : attendancePercentage,
        partTimeHours: isNaN(partTimeHours) ? null : partTimeHours,
        familySupport: isNaN(familySupport) ? null : familySupport,
      };

      records.push(recordData);
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
          console.warn(`Predict failed [${r.courseCode}]: ${e.message}`);
        }
      }
    }

    return { message: `Imported ${rows.length} rows.` };
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

  // Helper method to convert raw score to GPA (assuming 4.0 scale)
  private convertRawScoreToGPA(rawScore: number): number {
    // Assuming raw score is out of 10, convert to 4.0 GPA scale
    if (rawScore >= 8.5) return 4.0;
    if (rawScore >= 8.0) return 3.7;
    if (rawScore >= 7.5) return 3.3;
    if (rawScore >= 7.0) return 3.0;
    if (rawScore >= 6.5) return 2.7;
    if (rawScore >= 6.0) return 2.3;
    if (rawScore >= 5.5) return 2.0;
    if (rawScore >= 5.0) return 1.7;
    if (rawScore >= 4.0) return 1.0;
    return 0.0;
  }

  private calculateWeightedGPA(scores: Array<{ rawScore: number; creditsUnit: number }>): number {
    console.log(`DEBUG calculateWeightedGPA: Input scores length: ${scores.length}`);
    
    const totalCredits = scores.reduce((sum, score) => sum + score.creditsUnit, 0);
    console.log(`DEBUG calculateWeightedGPA: Total credits: ${totalCredits}`);
    
    if (totalCredits === 0) return 0;

    const totalGradePoints = scores.reduce((sum, score) => {
      const gpa = this.convertRawScoreToGPA(score.rawScore);
      console.log(`DEBUG: Raw score ${score.rawScore} -> GPA ${gpa} (${score.creditsUnit} credits)`);
      return sum + (gpa * score.creditsUnit);
    }, 0);

    console.log(`DEBUG calculateWeightedGPA: Total grade points: ${totalGradePoints}`);
    const finalGPA = totalGradePoints / totalCredits;
    console.log(`DEBUG calculateWeightedGPA: Final GPA: ${finalGPA}`);

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

    console.log(`DEBUG: Total records found: ${allRecords.length}`);
    
    // Log records with null rawScore
    const recordsWithoutScore = allRecords.filter(record => record.rawScore === null);
    console.log(`DEBUG: Records without rawScore: ${recordsWithoutScore.length}`);
    if (recordsWithoutScore.length > 0) {
      console.log(`DEBUG: Sample records without score:`, recordsWithoutScore.slice(0, 3).map(r => ({
        courseCode: r.courseCode,
        semester: `HK${r.semesterNumber}-${r.year}`,
        creditsUnit: r.creditsUnit,
        rawScore: r.rawScore
      })));
    }
    
    // Calculate cumulative GPA from actual scores only
    const actualScores = allRecords
      .filter(record => record.rawScore !== null)
      .map(record => ({
        rawScore: record.rawScore!,
        creditsUnit: record.creditsUnit
      }));

    console.log(`DEBUG: Actual scores count: ${actualScores.length}`);
    console.log(`DEBUG: Total actual credits: ${actualScores.reduce((sum, s) => sum + s.creditsUnit, 0)}`);
    console.log(`DEBUG: Sample actual scores:`, actualScores.slice(0, 5));

    const cumulativeGPA = this.calculateWeightedGPA(actualScores);

    // Calculate predicted GPA from ALL courses that have predictions
    const predictedScores = allRecords
      .filter(record => record.predictedScores.length > 0 && record.predictedScores[0].predictedScore !== null)
      .map(record => ({
        rawScore: record.predictedScores[0].predictedScore!,
        creditsUnit: record.creditsUnit
      }));

    const predictedGPA = this.calculateWeightedGPA(predictedScores);

    // Calculate "projected" GPA: actual scores + predicted scores for courses without actual scores
    const projectedScores: Array<{ rawScore: number; creditsUnit: number }> = [];
    
    allRecords.forEach(record => {
      if (record.rawScore !== null) {
        // Use actual score if available
        projectedScores.push({
          rawScore: record.rawScore,
          creditsUnit: record.creditsUnit
        });
      } else if (record.predictedScores.length > 0 && record.predictedScores[0].predictedScore !== null) {
        // Use predicted score if no actual score
        projectedScores.push({
          rawScore: record.predictedScores[0].predictedScore,
          creditsUnit: record.creditsUnit
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
      const actualRecords = records.filter(r => r.rawScore !== null);
      const predictedRecords = records.filter(r => r.predictedScores.length > 0 && r.predictedScores[0].predictedScore !== null);
      
      // Combined records for projected GPA
      const combinedRecords: Array<{ rawScore: number; creditsUnit: number }> = [];
      records.forEach(record => {
        if (record.rawScore !== null) {
          combinedRecords.push({ rawScore: record.rawScore, creditsUnit: record.creditsUnit });
        } else if (record.predictedScores.length > 0 && record.predictedScores[0].predictedScore !== null) {
          combinedRecords.push({ rawScore: record.predictedScores[0].predictedScore, creditsUnit: record.creditsUnit });
        }
      });
      
      const actualGPA = actualRecords.length > 0 
        ? this.calculateWeightedGPA(actualRecords.map(r => ({ rawScore: r.rawScore!, creditsUnit: r.creditsUnit })))
        : 0;
        
      const predictedGPA = predictedRecords.length > 0
        ? this.calculateWeightedGPA(predictedRecords.map(r => ({ rawScore: r.predictedScores[0].predictedScore!, creditsUnit: r.creditsUnit })))
        : 0;

      const projectedGPA = combinedRecords.length > 0
        ? this.calculateWeightedGPA(combinedRecords)
        : 0;

      const completedCredits = actualRecords.reduce((sum, r) => sum + r.creditsUnit, 0);
      const totalCredits = records.reduce((sum, r) => sum + r.creditsUnit, 0);
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

    console.log(`DEBUG getGPAStats final result:`, {
      totalCompletedCredits: actualScores.reduce((sum, s) => sum + s.creditsUnit, 0),
      totalCredits: allRecords.reduce((sum, r) => sum + r.creditsUnit, 0),
      completedCourses: actualScores.length,
      totalCourses: allRecords.length,
      recordsWithoutScore: allRecords.filter(r => r.rawScore === null).length
    });

    return {
      cumulativeGPA,        // GPA từ điểm thực tế đã có
      predictedGPA,         // GPA từ tất cả dự đoán
      projectedGPA,         // GPA kết hợp (thực tế + dự đoán cho môn thiếu)
      totalCompletedCredits: actualScores.reduce((sum, s) => sum + s.creditsUnit, 0),
      totalCredits: allRecords.reduce((sum, r) => sum + r.creditsUnit, 0),
      totalPredictedCredits: predictedScores.reduce((sum, s) => sum + s.creditsUnit, 0),
      semesterGPAs,
      totalCourses: allRecords.length,
      completedCourses: actualScores.length,
      predictedCourses: predictedScores.length
    };
  }
}
