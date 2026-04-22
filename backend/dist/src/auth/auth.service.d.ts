import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(email: string, password: string, username: string, name?: string): Promise<{
        id: number;
        email: string;
        username: string;
        name: string;
        role: string;
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        id: number;
        email: string;
        username: string;
        name: string;
        role: string;
        token: string;
    }>;
    validateUser(userId: number): Promise<{
        name: string;
        id: number;
        username: string;
        email: string;
        password_hash: string;
        role: string;
    } | null>;
}
