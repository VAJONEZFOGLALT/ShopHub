import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        username: string;
        email: string;
        password_hash: string;
        name: string;
        avatar: string | null;
        role: string;
    }>;
    findAll(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: number;
        username: string;
        email: string;
        password_hash: string;
        name: string;
        avatar: string | null;
        role: string;
    }[]>;
    findOne(id: number): import("../../generated/prisma/models").Prisma__UsersClient<{
        id: number;
        username: string;
        email: string;
        password_hash: string;
        name: string;
        avatar: string | null;
        role: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        id: number;
        username: string;
        email: string;
        password_hash: string;
        name: string;
        avatar: string | null;
        role: string;
    }>;
    remove(id: number): import("../../generated/prisma/models").Prisma__UsersClient<{
        id: number;
        username: string;
        email: string;
        password_hash: string;
        name: string;
        avatar: string | null;
        role: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
