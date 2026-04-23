import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    private createTokens;
    private buildAuthResponse;
    private validatePassword;
    register(email: string, password: string, username: string, name?: string): Promise<{
        id: number;
        email: string;
        username: string;
        name: string;
        role: string;
        token: string;
        refreshToken: string;
    }>;
    login(identifier: string, password: string): Promise<{
        id: number;
        email: string;
        username: string;
        name: string;
        role: string;
        token: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        id: number;
        email: string;
        username: string;
        name: string;
        role: string;
        token: string;
        refreshToken: string;
    }>;
    validateUser(userId: number): Promise<any>;
}
