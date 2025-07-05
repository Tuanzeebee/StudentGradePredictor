import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthUseCase {
  constructor(private authService: AuthService) {}

  async register(dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  async login(dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
