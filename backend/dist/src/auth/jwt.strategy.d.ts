import { AuthService } from './auth.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(payload: any): Promise<{
        username: string;
        email: string;
        name: string;
        role: string;
        avatar: string | null;
        password_hash: string;
        id: number;
    } | null>;
}
export {};
