import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({
    summary: 'Register a new account',
    description: 'Creates a user account and returns access and refresh tokens together with the public user profile.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiConflictResponse({ description: 'Email or username already exists.' })
  @ApiBadRequestResponse({ description: 'Password rules were not satisfied.' })
  @ApiTooManyRequestsResponse({ description: 'Too many registration attempts in a short time.' })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password, body.username, body.name);
  }

  @Post('login')
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @ApiOperation({
    summary: 'Log in with email or username',
    description: 'Accepts either an email address or username in the identifier field and returns new JWT tokens.',
  })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  @ApiTooManyRequestsResponse({ description: 'Too many login attempts in a short time.' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.identifier, body.password);
  }

  @Post('refresh')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary: 'Refresh tokens',
    description: 'Validates a refresh token and issues a new access token and refresh token pair.',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Refresh token is invalid, expired, or missing.' })
  @ApiTooManyRequestsResponse({ description: 'Too many refresh attempts in a short time.' })
  async refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }
}
