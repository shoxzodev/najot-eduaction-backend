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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
const email_service_1 = require("../../common/email/email.service");
const sms_1 = require("../../common/service/sms");
let StudentsService = class StudentsService {
    prisma;
    emailService;
    smsService;
    constructor(prisma, emailService, smsService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.smsService = smsService;
    }
    async getMyGroups(currentUser) {
        const myGroups = await this.prisma.studentGroup.findMany({
            where: {
                student_id: currentUser.id
            },
            select: {
                groups: {
                    select: {
                        id: true,
                        name: true,
                        start_date: true,
                        week_day: true,
                        start_time: true,
                        courses: {
                            select: {
                                name: true,
                                duration_hours: true,
                            }
                        },
                        _count: {
                            select: {
                                GroupTeacher: true
                            }
                        },
                        GroupTeacher: {
                            select: {
                                Teacher: {
                                    select: {
                                        full_name: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        const formattedGroup = myGroups.map(el => ({
            groupName: el.groups.name,
            courseName: el.groups.courses.name,
            teachersCount: el.groups._count.GroupTeacher,
            startDate: el.groups.start_date,
            groupId: el.groups.id,
            teachers: el.groups.GroupTeacher.map(teacher => ({
                full_name: teacher.Teacher.full_name,
                role: "TEACHER",
                week_day: el.groups.week_day,
                start_time: el.groups.start_time,
                duration_hours: el.groups.courses.duration_hours,
            }))
        }));
        return {
            success: true,
            data: formattedGroup
        };
    }
    async getAllStudents(pagination) {
        const { page, limit } = pagination;
        const students = await this.prisma.student.findMany({
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
                birth_date: true,
                created_at: true,
                studentGroups: {
                    select: {
                        groups: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            skip: (limit ? +limit : 10) * (page ? +page - 1 : 0),
            take: limit ? +limit : 10
        });
        const formattedStudents = students.map(student => {
            return {
                id: student.id,
                full_name: student.full_name,
                phone: student.phone,
                photo: student.photo,
                email: student.email,
                address: student.address,
                birth_date: student.birth_date,
                created_at: student.created_at,
                groups: student.studentGroups.map(group => group.groups)
            };
        });
        return {
            success: true,
            data: formattedStudents
        };
    }
    async getArchiveStudents() {
        const students = await this.prisma.student.findMany({
            where: {
                status: client_1.StudentStatus.inactive
            },
            select: {
                id: true,
                full_name: true,
                phone: true,
                photo: true,
                email: true,
                address: true,
                birth_date: true,
                created_at: true,
                studentGroups: {
                    select: {
                        groups: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
        const formattedStudents = students.map(student => {
            return {
                id: student.id,
                full_name: student.full_name,
                phone: student.phone,
                photo: student.photo,
                email: student.email,
                address: student.address,
                birth_date: student.birth_date,
                created_at: student.created_at,
                groups: student.studentGroups.map(group => group.groups)
            };
        });
        return {
            success: true,
            data: formattedStudents
        };
    }
    async getOneStudent(id) {
        const student = await this.prisma.student.findUnique({
            where: { id },
            select: {
                id: true,
                full_name: true,
                phone: true,
                photo: true,
                email: true,
                address: true,
                birth_date: true,
                created_at: true,
                studentGroups: {
                    select: {
                        groups: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
        if (!student) {
            throw new common_1.NotFoundException("Student not found");
        }
        const dataFormatter = {
            id: student.id,
            full_name: student.full_name,
            phone: student.phone,
            photo: student.photo,
            email: student.email,
            address: student.address,
            birth_date: student.birth_date,
            created_at: student.created_at,
            groups: student.studentGroups.map(group => group.groups)
        };
        return {
            success: true,
            data: dataFormatter
        };
    }
    async createStudent(payload, filename) {
        const existStudent = await this.prisma.student.findFirst({
            where: {
                OR: [
                    { phone: payload.phone },
                    { email: payload.email }
                ]
            }
        });
        if (existStudent) {
            throw new common_1.ConflictException("user with this phone or email already exists");
        }
        const existGroups = await this.prisma.group.findMany({
            where: {
                id: {
                    in: payload.groups
                }
            }
        });
        if (existGroups.length !== payload.groups?.length) {
            throw new common_1.ConflictException("Group not found");
        }
        const hashPass = await bcrypt.hash(payload.password, 10);
        await this.prisma.student.create({
            data: {
                full_name: payload.full_name,
                photo: filename ?? null,
                phone: payload.phone,
                birth_date: new Date(payload.birth_date),
                email: payload.email,
                password: hashPass,
                address: payload.address,
                studentGroups: payload.groups?.length ? {
                    create: payload.groups?.map(gId => ({ group_id: gId }))
                } : undefined
            }
        });
        return {
            success: true,
            message: "Student created"
        };
    }
    async createHomeworkAnswer(homeworkId, user, payload, filename) {
        console.log(payload);
        const existHomework = await this.prisma.homework.findFirst({
            where: {
                id: homeworkId
            }
        });
        if (!existHomework) {
            throw new common_1.ConflictException("Homework not found");
        }
        const existHomeworkAnswer = await this.prisma.homeworkAnswerStudent.findFirst({
            where: {
                homework_id: homeworkId,
                student_id: user.id
            }
        });
        if (existHomeworkAnswer) {
            throw new common_1.ConflictException("Homework answer already exists");
        }
        await this.prisma.homeworkAnswerStudent.create({
            data: {
                homework_id: homeworkId,
                student_id: user.id,
                file: filename ?? null,
                title: payload.title,
            }
        });
        return {
            success: true,
            message: "Homework answer created"
        };
    }
    async deleteStudent(id) {
        const existStudent = await this.prisma.student.findUnique({
            where: { id }
        });
        if (!existStudent) {
            throw new common_1.ConflictException("Student not found");
        }
        await this.prisma.student.update({
            where: { id },
            data: { status: client_1.StudentStatus.inactive }
        });
        return {
            success: true,
            message: "Student deleted"
        };
    }
    async updateStudent(id, payload, filename) {
        const existStudent = await this.prisma.student.findUnique({
            where: { id }
        });
        if (!existStudent) {
            throw new common_1.NotFoundException("Student not found");
        }
        if (payload.phone || payload.email) {
            const duplicateStudent = await this.prisma.student.findFirst({
                where: {
                    OR: [
                        { phone: payload.phone ?? "" },
                        { email: payload.email ?? "" }
                    ],
                    NOT: { id }
                }
            });
            if (duplicateStudent) {
                throw new common_1.ConflictException("Phone or email already exists");
            }
        }
        let hashPass;
        if (payload.password) {
            hashPass = await bcrypt.hash(payload.password, 10);
        }
        const { groups, ...studentData } = payload;
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
            await this.prisma.studentGroup.deleteMany({
                where: { student_id: id }
            });
        }
        await this.prisma.student.update({
            where: { id },
            data: {
                ...studentData,
                ...(payload.birth_date && { birth_date: new Date(payload.birth_date) }),
                ...(filename && { photo: filename }),
                ...(hashPass && { password: hashPass }),
                ...(groups !== undefined && {
                    studentGroups: groups?.length ? {
                        create: groups?.map(gId => ({ group_id: gId }))
                    } : undefined
                })
            }
        });
        return {
            success: true,
            message: "Student updated"
        };
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        sms_1.EskizService])
], StudentsService);
//# sourceMappingURL=students.service.js.map