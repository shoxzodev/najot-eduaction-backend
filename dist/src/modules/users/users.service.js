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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllAdmins() {
        const admins = await this.prisma.user.findMany({
            where: {
                status: client_1.Status.active,
                role: client_1.Role.ADMIN
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                photo: true,
                role: true,
            }
        });
        return {
            success: true,
            data: admins
        };
    }
    async createAdmin(payload) {
        const adminExists = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { phone: payload.phone },
                    { email: payload.email }
                ]
            }
        });
        if (adminExists)
            throw new common_1.ConflictException();
        const hashPass = await bcrypt.hash(payload.password, 10);
        await this.prisma.user.create({
            data: {
                ...payload,
                role: client_1.Role.ADMIN,
                password: hashPass
            }
        });
        return {
            success: true,
            message: "create admin successfully"
        };
    }
    async getUserInfo(userData) {
        if (userData.role == "TEACHER") {
            const teachers = this
                .prisma
                .teacher
                .findUnique({ where: { id: userData.id }, select: {
                    id: true,
                    full_name: true,
                    email: true,
                    phone: true,
                    photo: true
                } });
            const teacherGroup = this
                .prisma
                .groupTeacher
                .findMany({
                where: { teacher_id: userData.id },
                select: {
                    Group: {}
                }
            });
            const main = await Promise.all([teachers, teacherGroup]);
            const normalizeGroup = main[1].reduce((acc, item) => {
                acc.push({
                    id: item.Group.course_id,
                    name: item.Group.name
                });
                return acc;
            }, []);
            return {
                success: true,
                user: main[0],
                role: userData.role,
                groups: normalizeGroup
            };
        }
        else if (userData.role == "STUDENT") {
            const student = this.prisma.student.findUnique({ where: { id: userData.id }, select: {
                    id: true,
                    full_name: true,
                    email: true,
                    phone: true,
                    photo: true
                } });
            const studentGroup = this.prisma.studentGroup.findMany({ where: {
                    id: userData.id
                },
                select: {
                    groups: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
            const parallel = await Promise.all([student, studentGroup]);
            const normalizeGroup = parallel[1].reduce((acc, item) => {
                acc.push({ id: item.groups.id, name: item.groups.name });
                return acc;
            }, []);
            return {
                success: true,
                user: parallel[0],
                group: normalizeGroup
            };
        }
        else if (userData.role == "ADMIN") {
            const admin = await this.prisma.user.findUnique({ where: { id: userData.id }, select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    photo: true,
                    role: true
                } });
            return {
                success: true,
                user: admin
            };
        }
        else {
            const superadmin = await this.prisma.user.findUnique({ where: { id: userData.id }, select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    phone: true,
                    email: true,
                    photo: true,
                    role: true
                } });
            return {
                success: true,
                user: superadmin
            };
        }
    }
    async changeUserInfo(userData, payload, file) {
        if (userData.role == "STUDENT") {
            const existStudent = await this.prisma.student.findUnique({ where: { id: userData.id }, select: {
                    email: true,
                    password: true,
                    photo: true,
                    phone: true
                } });
            const verifyPassword = bcrypt.compareSync(payload.current_password, existStudent?.password);
            if (!verifyPassword)
                throw new common_1.ConflictException("user's current password incorrect");
            const newPassword = bcrypt.hashSync(payload.new_password, 10);
            const image = Date.now() + "." + file?.mimetype.split("/")[1];
            try {
                await this.prisma.student.update({ where: { id: userData.id }, data: {
                        email: payload.email ? payload.email : existStudent?.email,
                        phone: payload.phone ? payload.phone : existStudent?.phone,
                        password: payload.new_password ? newPassword : existStudent?.password,
                        photo: image ? image : payload.phone
                    } });
                return {
                    success: true,
                    message: "user updated successfully"
                };
            }
            catch (err) {
                if (err instanceof Error && err.name == "PrismaClientKnownRequestError")
                    throw new common_1.ConflictException("user's email or phone already exists");
            }
        }
        else if (userData.role == "TEACHER") {
            const existTeacher = await this.prisma.teacher.findUnique({ where: { id: userData.id }, select: {
                    email: true,
                    password: true,
                    photo: true,
                    phone: true
                } });
            const verifyPassword = bcrypt.compareSync(payload.current_password, existTeacher?.password);
            if (!verifyPassword)
                throw new common_1.ConflictException("user's current password incorrect");
            const newPassword = bcrypt.hashSync(payload.new_password, 10);
            const image = Date.now() + "." + file?.mimetype.split("/")[1];
            try {
                await this.prisma.student.update({ where: { id: userData.id }, data: {
                        email: payload.email ? payload.email : existTeacher?.email,
                        phone: payload.phone ? payload.phone : existTeacher?.phone,
                        password: payload.new_password ? newPassword : existTeacher?.password,
                        photo: image ? image : payload.phone
                    } });
                return {
                    success: true,
                    message: "user updated successfully"
                };
            }
            catch (err) {
                if (err instanceof Error && err.name == "PrismaClientKnownRequestError")
                    throw new common_1.ConflictException("user's email or phone already exists");
            }
        }
        else {
            const existAdmin = await this.prisma.user.findUnique({ where: { id: userData.id }, select: {
                    email: true,
                    password: true,
                    photo: true,
                    phone: true
                } });
            const verifyPassword = bcrypt.compareSync(payload.current_password, existAdmin?.password);
            if (!verifyPassword)
                throw new common_1.ConflictException("user's current password incorrect");
            const newPassword = bcrypt.hashSync(payload.new_password, 10);
            const image = Date.now() + "." + file?.mimetype.split("/")[1];
            try {
                await this.prisma.student.update({ where: { id: userData.id }, data: {
                        email: payload.email ? payload.email : existAdmin?.email,
                        phone: payload.phone ? payload.phone : existAdmin?.phone,
                        password: payload.new_password ? newPassword : existAdmin?.password,
                        photo: image ? image : payload.phone
                    } });
                return {
                    success: true,
                    message: "user updated successfully"
                };
            }
            catch (err) {
                if (err instanceof Error && err.name == "PrismaClientKnownRequestError")
                    throw new common_1.ConflictException("user's email or phone already exists");
            }
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map