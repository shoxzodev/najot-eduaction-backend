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
const users_service_1 = require("./users.service");
const create_admin_dto_1 = require("./dto/create.admin.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const role_1 = require("../../common/decorators/role");
const client_1 = require("@prisma/client");
const role_guard_1 = require("../../common/guards/role.guard");
const swagger_1 = require("@nestjs/swagger");
const change_personal_data_dto_1 = require("./dto/change.personal-data.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
let UsersController = class UsersController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    getAllAdmins() {
        return this.userService.getAllAdmins();
    }
    createAdmin(payload) {
        return this.userService.createAdmin(payload);
    }
    getUserInfo(req) {
        return this.userService.getUserInfo(req["user"]);
    }
    async changeUserPersonalData(req, payload, file) {
        return await this.userService.changeUserInfo(req["user"], payload, file);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.SUPERADMIN}`
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.SUPERADMIN),
    (0, common_1.Get)('admin/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllAdmins", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.SUPERADMIN}, ${client_1.Role.ADMIN}`
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard),
    (0, role_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPERADMIN),
    (0, common_1.Post)("admin"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createAdmin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.ADMIN} , ${client_1.Role.STUDENT} ${client_1.Role.TEACHER} ${client_1.Role.SUPERADMIN}`
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard),
    (0, role_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.STUDENT, client_1.Role.SUPERADMIN),
    (0, common_1.Get)("personal/info"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.ADMIN} , ${client_1.Role.STUDENT} ${client_1.Role.TEACHER}`
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard),
    (0, role_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.STUDENT),
    (0, common_1.Patch)("personal/info"),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                email: { type: "string", example: "email@gmail.com" },
                photo: { type: "string", format: "binary" },
                phone: { type: "string", example: "+998995507613" },
                current_password: { type: "string", example: "x04041234A" },
                new_password: { type: "string", example: "x04041234A" }
            }
        }
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("photo", {
        storage: (0, multer_1.diskStorage)({
            destination: "./src/uploads",
            filename: (_, file, cb) => {
                const filename = Date.now() + "." + file.mimetype.split("/")[1];
                cb(null, filename);
            }
        }),
        fileFilter: (_, file, cb) => {
            const existFile = ["png", "jpg", "jpeg"];
            if (!existFile.includes(file.mimetype.split("/")[1])) {
                cb(new common_1.UnsupportedMediaTypeException(), false);
            }
            cb(null, true);
        }
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, change_personal_data_dto_1.ChangePersonalDataDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeUserPersonalData", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map