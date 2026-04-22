import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async register(@Body() body: { email: string; password: string; username: string; name?: string }) {
    return this.authService.register(body.email, body.password, body.username, body.name);
  }

  @Post('login')
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  async login(@Body() body: { identifier: string; password: string }) {
    return this.authService.login(body.identifier, body.password);
  }

  @Post('refresh')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }
}
