import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<{
        id: number;
        email: string;
        username: string;
        name: string;
        role: string;
        token: string;
        refreshToken: string;
    }>;
    login(body: LoginDto): Promise<{
        id: number;
        email: string;
        username: string;
        name: string;
        role: string;
        token: string;
        refreshToken: string;
    }>;
    refresh(body: RefreshTokenDto): Promise<{
        id: number;
        email: string;
        username: string;
        name: string;
        role: string;
        token: string;
        refreshToken: string;
    }>;
}
