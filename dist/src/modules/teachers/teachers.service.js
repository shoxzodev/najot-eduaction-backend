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
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
let TeachersService = class TeachersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllTeachers() {
        const teachers = await this.prisma.teacher.findMany({
            where: {
                status: client_1.Status.active
            },
            select: {
                id: true,
                full_name: true,
                phone: true,
                photo: true,
                email: true,
                address: true,
                created_at: true,
                GroupTeacher: {
                    select: {
                        Group: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
        const dataFormatter = teachers.map(el => ({
            ...el,
            groups: el.GroupTeacher.map(gt => gt.Group.name)
        }));
        return {
            success: true,
            data: dataFormatter
        };
    }
    async getMyGroups(teacherId) {
        const groups = await this.prisma.group.findMany({
            where: {
                GroupTeacher: {
                    some: {
                        teacher_id: teacherId,
                        status: client_1.TeacherGroupStatus.active
                    }
                }
            },
            select: {
                id: true,
                name: true,
                max_student: true,
                start_date: true,
                start_time: true,
                week_day: true,
                status: true,
                courses: {
                    select: {
                        id: true,
                        name: true,
                        duration_month: true
                    }
                },
                rooms: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                studentGroups: {
                    select: {
                        students: {
                            select: {
                                id: true,
                                full_name: true
                            }
                        }
                    }
                }
            }
        });
        const dataFormatter = groups.map((el) => ({
            id: el.id,
            name: el.name,
            start_date: el.start_date,
            start_time: el.start_time,
            week_day: el.week_day,
            status: el.status,
            course: {
                name: el.courses.name,
                duration_month: el.courses.duration_month,
            },
            room: el.rooms.name,
            student_count: el.studentGroups.length,
            students: el.studentGroups.map(sg => sg.students)
        }));
        return {
            success: true,
            data: dataFormatter
        };
    }
    async getArchiveTeachers() {
        const teachers = await this.prisma.teacher.findMany({
            where: {
                status: client_1.Status.inactive
            },
            select: {
                id: true,
                full_name: true,
                phone: true,
                photo: true,
                email: true,
                address: true,
                created_at: true,
                GroupTeacher: {
                    select: {
                        Group: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
        const dataFormatter = teachers.map(el => ({
            ...el,
            groups: el.GroupTeacher.map(gt => gt.Group.name)
        }));
        return {
            success: true,
            data: dataFormatter
        };
    }
    async getOneTeacher(id) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { id },
            select: {
                id: true,
                full_name: true,
                phone: true,
                photo: true,
                email: true,
                address: true,
                created_at: true,
                GroupTeacher: {
                    select: {
                        Group: {
                            select: { name: true }
                        }
                    }
                }
            }
        });
        if (!teacher) {
            throw new common_1.NotFoundException("Teacher not found");
        }
        const dataFormatter = {
            id: teacher.id,
            full_name: teacher.full_name,
            phone: teacher.phone,
            photo: teacher.photo,
            email: teacher.email,
            address: teacher.address,
            created_at: teacher.created_at,
            groups: teacher.GroupTeacher.map(gt => gt.Group.name)
        };
        return {
            success: true,
            data: dataFormatter
        };
    }
    async createTeacher(payload, filename) {
        const existTeacher = await this.prisma.teacher.findFirst({
            where: {
                OR: [
                    { phone: payload.phone },
                    { email: payload.email }
                ]
            }
        });
        if (existTeacher) {
            throw new common_1.ConflictException();
        }
        const hashPass = await bcrypt.hash(payload.password, 10);
        const { groups, ...teacherData } = payload;
        const existingGroups = await this.prisma.group.findMany({
            where: {
                id: {
                    in: groups
                },
                status: client_1.Status.active
            }
        });
        if (existingGroups.length != groups?.length) {
            throw new common_1.NotFoundException("Group is not found or inactive with this id");
        }
        await this.prisma.teacher.create({
            data: {
                ...teacherData,
                photo: filename ?? null,
                password: hashPass,
                GroupTeacher: groups?.length ? {
                    create: groups?.map(id => ({ group_id: id }))
                } : undefined
            }
        });
        return {
            success: true,
            message: "Teacher created"
        };
    }
    async deleteTeacher(id) {
        const existTeacher = await this.prisma.teacher.findUnique({
            where: {
                id,
                status: client_1.Status.active
            }
        });
        if (!existTeacher) {
            throw new common_1.NotFoundException("Teacher not found");
        }
        await this.prisma.teacher.update({
            where: {
                id
            },
            data: {
                status: client_1.Status.inactive
            }
        });
        return {
            success: true,
            message: "Teacher deleted"
        };
    }
    async updateTeacher(id, payload, filename) {
        const existTeacher = await this.prisma.teacher.findUnique({
            where: { id }
        });
        if (!existTeacher) {
            throw new common_1.NotFoundException("Teacher not found");
        }
        if (payload.phone || payload.email) {
            const duplicateTeacher = await this.prisma.teacher.findFirst({
                where: {
                    OR: [
                        { phone: payload.phone ?? "" },
                        { email: payload.email ?? "" }
                    ],
                    NOT: { id }
                }
            });
            if (duplicateTeacher) {
                throw new common_1.ConflictException("Phone or email already exists");
            }
        }
        let hashPass;
        if (payload.password) {
            hashPass = await bcrypt.hash(payload.password, 10);
        }
        const { groups, ...teacherData } = payload;
        if (groups !== undefined) {
            const existingGroups = await this.prisma.group.findMany({
                where: {
                    id: { in: groups },
                    status: client_1.Status.active
                }
            });
            if (existingGroups.length !== groups?.length) {
                throw new common_1.NotFoundException("Group is not found or inactive");
            }
            await this.prisma.groupTeacher.deleteMany({
                where: { teacher_id: id }
            });
        }
        await this.prisma.teacher.update({
            where: { id },
            data: {
                ...teacherData,
                ...(filename && { photo: filename }),
                ...(hashPass && { password: hashPass }),
                ...(groups !== undefined && {
                    GroupTeacher: groups?.length ? {
                        create: groups?.map(gId => ({ group_id: gId }))
                    } : undefined
                })
            }
        });
        return {
            success: true,
            message: "Teacher updated"
        };
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map