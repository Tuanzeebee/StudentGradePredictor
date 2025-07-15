import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';
import { AuthUseCase } from './use-cases/auth.use-case';
import { AuthController } from './controllers/auth.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, AuthUseCase, JwtStrategy, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
