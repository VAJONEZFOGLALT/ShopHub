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
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        id: number;
        email: string;
        username: string;
        name: string;
        role: string;
        token: string;
    }>;
}
