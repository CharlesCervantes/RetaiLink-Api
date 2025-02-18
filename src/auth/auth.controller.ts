import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() data: {
      username: string;
      password: string;
      nombre?: string;
      apellido_paterno?: string;
      apellido_materno?: string;
    },
  ) {
    return this.authService.signup(data);
  }

  @Post('signin')
  async signin(
    @Body() data: { username: string; password: string },
  ) {
    return this.authService.signin(data.username, data.password);
  }
}