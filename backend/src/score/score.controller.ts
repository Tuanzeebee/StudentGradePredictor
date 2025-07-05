import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    Req,
    Get,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ScoreService } from './score.service';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  
  @Controller('scores')
  export class ScoreController {
    constructor(private readonly scoreService: ScoreService) {}
  
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
            return cb(new BadRequestException('Only CSV files are allowed!'), false);
          }
          cb(null, true);
        },
      }),
    )
    async uploadCsv(@UploadedFile() file: Express.Multer.File) {
      if (!file) throw new BadRequestException('No file uploaded');
      return this.scoreService.importFromCsv(file.path);
    }
    @Get('chart-data')
    async getChartData() {
    const userId = 1; // TODO: lấy từ JWT sau
    return this.scoreService.getChartData(userId);
    }

  }
  