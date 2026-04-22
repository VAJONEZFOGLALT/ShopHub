import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private createTokens(user: { id: number; email: string }) {
    const token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '7d' }
    );
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '30d' }
    );
    return { token, refreshToken };
  }

  private buildAuthResponse(user: { id: number; email: string; username: string; name: string; role: string }) {
    const { token, refreshToken } = this.createTokens(user);
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      token,
      refreshToken,
    };
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException('Password must contain an uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      throw new BadRequestException('Password must contain a number');
    }
  }

  async register(email: string, password: string, username: string, name?: string) {
    this.validatePassword(password);

    const existingUser = await this.prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });
    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.users.create({
      data: {
        email,
        password_hash: hashedPassword,
        username,
        name: name || username,
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(identifier: string, password: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken) as { sub: number; type?: string };
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const user = await this.prisma.users.findUnique({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return this.buildAuthResponse(user);
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(userId: number) {
    return this.prisma.users.findUnique({ where: { id: userId } });
  }
}
