import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthUseCase } from './use-cases/auth.use-case';
import { AuthService } from './services/auth.service';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthUseCase, AuthService],
})
export class AuthModule {}
