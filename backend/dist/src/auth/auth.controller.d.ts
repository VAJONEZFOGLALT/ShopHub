import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
        username: string;
        name?: string;
    }): Promise<{
        id: number;
        email: string;
        username: string;
        name: string;
        role: string;
        token: string;
        refreshToken: string;
    }>;
    login(body: {
        identifier: string;
        password: string;
    }): Promise<{
        id: number;
        email: string;
        username: string;
        name: string;
        role: string;
        token: string;
        refreshToken: string;
    }>;
    refresh(body: {
        refreshToken: string;
    }): Promise<{
        id: number;
        email: string;
        username: string;
        name: string;
        role: string;
        token: string;
        refreshToken: string;
    }>;
}
