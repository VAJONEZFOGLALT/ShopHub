import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): import("../../generated/prisma/models").Prisma__UsersClient<{
        name: string;
        id: number;
        username: string;
        email: string;
        password_hash: string;
        role: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    findAll(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        name: string;
        id: number;
        username: string;
        email: string;
        password_hash: string;
        role: string;
    }[]>;
    findOne(id: number): import("../../generated/prisma/models").Prisma__UsersClient<{
        name: string;
        id: number;
        username: string;
        email: string;
        password_hash: string;
        role: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): import("../../generated/prisma/models").Prisma__UsersClient<{
        name: string;
        id: number;
        username: string;
        email: string;
        password_hash: string;
        role: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    remove(id: number): import("../../generated/prisma/models").Prisma__UsersClient<{
        name: string;
        id: number;
        username: string;
        email: string;
        password_hash: string;
        role: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
