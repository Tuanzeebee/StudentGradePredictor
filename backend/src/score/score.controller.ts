import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  UseGuards,
  Body,
  Put,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ScoreService } from './score.service';
import { SaveScoreDto } from './dto/save-score.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('scores')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (!file.originalname.match(/\.csv$/)) {
          return cb(new BadRequestException('Chỉ chấp nhận file CSV!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    return this.scoreService.importFromCsv(file.path, user.id);
  }
  @Get('chart-data')
  @UseGuards(JwtAuthGuard)
  async getChartData(@CurrentUser() user: { id: number }) {
    return this.scoreService.getChartData(user.id);
  }

  @Post('save')
  @UseGuards(JwtAuthGuard)
  async savePredictedScore(
    @Body() saveScoreDto: SaveScoreDto,
    @CurrentUser() user: User,
  ) {
    return this.scoreService.savePredictedScore(saveScoreDto, user.id);
  }

  @Get('gpa-stats')
  @UseGuards(JwtAuthGuard)
  async getGPAStats(@CurrentUser() user: User) {
    return this.scoreService.getGPAStats(user.id);
  }

  @Get('predicted-gpa-stats')
  @UseGuards(JwtAuthGuard)
  async getPredictedGPAStats(@CurrentUser() user: User) {
    return this.scoreService.getPredictedGPAStats(user.id);
  }

  @Post('fill-missing-values')
  @UseGuards(JwtAuthGuard)
  async fillMissingValues(@CurrentUser() user: User) {
    return this.scoreService.fillMissingValuesWithMedian(user.id);
  }

  @Get('analyze-data')
  @UseGuards(JwtAuthGuard)
  async analyzeDataAvailability(@CurrentUser() user: User) {
    return this.scoreService.analyzeDataAvailability(user.id);
  }

  @Post('auto-predict')
  @UseGuards(JwtAuthGuard)
  async autoPredictMissingScores(@CurrentUser() user: User) {
    return this.scoreService.autoPredictMissingScores(user.id);
  }

  @Get('prediction-status')
  @UseGuards(JwtAuthGuard)
  async checkPredictionStatus(@CurrentUser() user: User) {
    return this.scoreService.checkPredictionStatus(user.id);
  }

  @Post('add-test-courses')
  @UseGuards(JwtAuthGuard)
  async addTestCoursesForPrediction(@CurrentUser() user: User) {
    return this.scoreService.addTestCoursesForPrediction(user.id);
  }

  @Post('update-predicted-conversions')
  @UseGuards(JwtAuthGuard)
  async updatePredictedScoreConversions(@CurrentUser() user: User) {
    return this.scoreService.updatePredictedScoreConversions(user.id);
  }

  @Post('update-actual-conversions')
  @UseGuards(JwtAuthGuard)
  async updateScoreRecordConversions(@CurrentUser() user: User) {
    return this.scoreService.updateScoreRecordConversions(user.id);
  }

  @Post('update-all-conversions')
  @UseGuards(JwtAuthGuard)
  async updateAllScoreConversions(@CurrentUser() user: User) {
    return this.scoreService.updateAllScoreConversions(user.id);
  }

  @Get('learning-path/:courseCode')
  @UseGuards(JwtAuthGuard)
  async getLearningPath(
    @Param('courseCode') courseCode: string,
    @CurrentUser() user: User,
  ) {
    return this.scoreService.getLearningPath(courseCode, user.id);
  }
}