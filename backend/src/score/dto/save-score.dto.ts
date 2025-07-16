import { IsNumber, IsString, IsNotEmpty, Min, Max } from 'class-validator';

export class SaveScoreDto {
  @IsNumber()
  @Min(1)
  @Max(8)
  semesterNumber: number;

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsNotEmpty()
  courseCode: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  predictedScore: number;

  @IsNumber()
  @Min(0)
  @Max(168)
  weeklyStudyHours: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  attendancePercentage: number;

  @IsNumber()
  @Min(0)
  @Max(40)
  commuteTimeMinutes: number;

  @IsNumber()
  @Min(0)
  @Max(3)
  familySupport: number;

  @IsString()
  @IsNotEmpty()
  studyFormat: string;

  @IsNumber()
  @Min(1)
  @Max(6)
  creditsUnit: number;
}
