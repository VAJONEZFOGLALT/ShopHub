"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const passport_1 = require("@nestjs/passport");
const sanitizeUser = (user) => {
    if (!user)
        return user;
    const { password_hash, ...safe } = user;
    return safe;
};
const sanitizeUsers = (users) => users.map(sanitizeUser);
let UsersController = class UsersController {
    usersService;
    cloudinaryService;
    constructor(usersService, cloudinaryService) {
        this.usersService = usersService;
        this.cloudinaryService = cloudinaryService;
    }
    isAdmin(req) {
        return req?.user?.role === 'ADMIN';
    }
    assertSelfOrAdmin(req, targetUserId, message = 'Forbidden') {
        if (this.isAdmin(req)) {
            return;
        }
        if (Number(req?.user?.id) !== Number(targetUserId)) {
            throw new common_1.ForbiddenException(message);
        }
    }
    async create(createUserDto) {
        const created = await this.usersService.create(createUserDto);
        return sanitizeUser(created);
    }
    async findAll(req) {
        if (!this.isAdmin(req)) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        const users = await this.usersService.findAll();
        return sanitizeUsers(users);
    }
    async findOne(id, req) {
        const targetUserId = Number(id);
        this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to view this user');
        const user = await this.usersService.findOne(targetUserId);
        return sanitizeUser(user);
    }
    async update(id, updateUserDto, req) {
        const targetUserId = Number(id);
        this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to update this user');
        if (!this.isAdmin(req) && Object.prototype.hasOwnProperty.call(updateUserDto, 'role')) {
            throw new common_1.ForbiddenException('You are not allowed to change roles');
        }
        const updated = await this.usersService.update(targetUserId, updateUserDto);
        return sanitizeUser(updated);
    }
    async uploadAvatar(id, file, req) {
        const targetUserId = Number(id);
        this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to update this avatar');
        const upload = await this.cloudinaryService.uploadImage(file, 'avatars');
        const updated = await this.usersService.update(targetUserId, { avatar: upload.url });
        return sanitizeUser(updated);
    }
    async remove(id, req) {
        const targetUserId = Number(id);
        this.assertSelfOrAdmin(req, targetUserId, 'You are not allowed to delete this user');
        const removed = await this.usersService.remove(targetUserId);
        return sanitizeUser(removed);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register a user' }),
    (0, swagger_1.ApiBody)({ type: create_user_dto_1.CreateUserDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'User created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'List users' }),
    (0, swagger_1.ApiOkResponse)({ description: 'User list.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 240027 }),
    (0, swagger_1.ApiOkResponse)({ description: 'User profile.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a user' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 240027 }),
    (0, swagger_1.ApiBody)({ type: update_user_dto_1.UpdateUserDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'User updated successfully.' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'You are not allowed to update this user or change roles.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/avatar'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 5 * 1024 * 1024 } })),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload avatar' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({ name: 'id', example: 240027 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Avatar uploaded successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('bearer-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a user' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 240027 }),
    (0, swagger_1.ApiOkResponse)({ description: 'User deleted successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        cloudinary_service_1.CloudinaryService])
], UsersController);
//# sourceMappingURL=users.controller.js.map