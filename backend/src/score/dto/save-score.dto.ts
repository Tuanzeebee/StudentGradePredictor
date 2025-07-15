// src/score/dto/save-score.dto.ts
export class SaveScoreDto {
  semesterNumber: number;
  year: string;
  courseCode: string;
  predictedScore: number;
  weeklyStudyHours: number;
  attendancePercentage: number;
  commuteTimeMinutes: number;
  familySupport: number;
  studyFormat: string;
  creditsUnit: number;
}
