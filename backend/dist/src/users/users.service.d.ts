import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        username: string;
        email: string;
        name: string;
        role: string;
        avatar: string | null;
        password_hash: string;
        id: number;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        username: string;
        email: string;
        name: string;
        role: string;
        avatar: string | null;
        password_hash: string;
        id: number;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__UsersClient<{
        username: string;
        email: string;
        name: string;
        role: string;
        avatar: string | null;
        password_hash: string;
        id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        username: string;
        email: string;
        name: string;
        role: string;
        avatar: string | null;
        password_hash: string;
        id: number;
    }>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__UsersClient<{
        username: string;
        email: string;
        name: string;
        role: string;
        avatar: string | null;
        password_hash: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
