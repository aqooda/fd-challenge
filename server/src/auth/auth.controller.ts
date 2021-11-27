import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LogoutDto } from './dtos';
import { AuthGuard } from '../auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() { email, password, refreshToken, type }: LoginDto) {
    if (type === 'REFRESH_TOKEN') {
      return this.authService.loginByRefreshToken(refreshToken);
    }

    return this.authService.login({ email, password });
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(200)
  logout(@Body() { refreshToken }: LogoutDto) {
    return this.authService.logout(refreshToken);
  }
}
