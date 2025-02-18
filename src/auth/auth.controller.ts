import { Controller, Post, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto } from './dto/auth.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body(ValidationPipe) data: SignupDto) {
    return this.authService.signup(data);
  }

  @Post('signin')
  async signin(@Body(ValidationPipe) data: SigninDto) {
    return this.authService.signin(data);
  }
}