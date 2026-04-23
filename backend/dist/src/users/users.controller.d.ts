import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class UsersController {
    private readonly usersService;
    private readonly cloudinaryService;
    constructor(usersService: UsersService, cloudinaryService: CloudinaryService);
    private isAdmin;
    private assertSelfOrAdmin;
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(req: any): Promise<any[]>;
    findOne(id: string, req: any): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<any>;
    uploadAvatar(id: string, file: Express.Multer.File, req: any): Promise<any>;
    remove(id: string, req: any): Promise<any>;
}
