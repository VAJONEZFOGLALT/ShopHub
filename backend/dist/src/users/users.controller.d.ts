import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    findOne(id: string): import("../../generated/prisma/models").Prisma__UsersClient<{
        name: string;
        id: number;
        username: string;
        email: string;
        password_hash: string;
        role: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): import("../../generated/prisma/models").Prisma__UsersClient<{
        name: string;
        id: number;
        username: string;
        email: string;
        password_hash: string;
        role: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    remove(id: string): import("../../generated/prisma/models").Prisma__UsersClient<{
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
