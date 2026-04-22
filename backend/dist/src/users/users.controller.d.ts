import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class UsersController {
    private readonly usersService;
    private readonly cloudinaryService;
    constructor(usersService: UsersService, cloudinaryService: CloudinaryService);
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    uploadAvatar(id: string, file: Express.Multer.File): Promise<any>;
    remove(id: string): Promise<any>;
}
