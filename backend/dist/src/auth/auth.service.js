"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    createTokens(user) {
        const token = this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '7d' });
        const refreshToken = this.jwtService.sign({ sub: user.id, type: 'refresh' }, { expiresIn: '30d' });
        return { token, refreshToken };
    }
    buildAuthResponse(user) {
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
    validatePassword(password) {
        if (password.length < 8) {
            throw new common_1.BadRequestException('Password must be at least 8 characters');
        }
        if (!/[A-Z]/.test(password)) {
            throw new common_1.BadRequestException('Password must contain an uppercase letter');
        }
        if (!/[0-9]/.test(password)) {
            throw new common_1.BadRequestException('Password must contain a number');
        }
    }
    async register(email, password, username, name) {
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
            throw new common_1.ConflictException('User with this email or username already exists');
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
    async login(identifier, password) {
        const user = await this.prisma.users.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier },
                ],
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.buildAuthResponse(user);
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            if (payload.type !== 'refresh') {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const user = await this.prisma.users.findUnique({ where: { id: payload.sub } });
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            return this.buildAuthResponse(user);
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async validateUser(userId) {
        return this.prisma.users.findUnique({ where: { id: userId } });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map