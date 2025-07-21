import { Controller, Post, Body } from '@nestjs/common';
import { AuthUseCase } from '../use-cases/auth.use-case';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly useCase: AuthUseCase) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.useCase.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.useCase.login(dto);
  }
}
