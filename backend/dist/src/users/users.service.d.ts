import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$UsersPayload<ExtArgs>, T, "create", GlobalOmitOptions>>;
    findAll(): runtime.Types.Public.PrismaPromise<T>;
    findOne(id: number): import("../../generated/prisma/models").Prisma__UsersClient<any, null, runtime.Types.Extensions.DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    private validatePasswordStrength;
    update(id: number, updateUserDto: UpdateUserDto): Promise<runtime.Types.Result.GetResult<import("../../generated/prisma/models").$UsersPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    remove(id: number): Promise<runtime.Types.Utils.JsPromise<R>>;
}
