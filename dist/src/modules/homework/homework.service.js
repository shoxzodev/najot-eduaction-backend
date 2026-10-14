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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeworkService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const client_1 = require("@prisma/client");
let HomeworkService = class HomeworkService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOwnHomework(lessonId, currentUser) {
        const myLessons = await this.prisma.homework.findMany({
            where: {
                lesson_id: lessonId
            },
            select: {
                id: true,
                title: true,
                file: true,
                created_at: true,
                update_at: true,
                teachers: {
                    select: {
                        id: true,
                        full_name: true,
                        phone: true,
                        photo: true
                    }
                },
                users: {
                    select: {
                        id: true,
                        last_name: true,
                        first_name: true,
                        phone: true,
                        photo: true
                    }
                }
            }
        });
        const homeworkFormated = myLessons.map(el => {
            if (!el.teachers) {
                return {
                    id: el.id,
                    title: el.title,
                    file: el.file,
                    created_at: el.created_at,
                    update_at: el.update_at,
                    user: el.users
                };
            }
            else {
                return {
                    id: el.id,
                    title: el.title,
                    file: el.file,
                    created_at: el.created_at,
                    update_at: el.update_at,
                    teacher: el.teachers
                };
            }
        });
        return {
            success: true,
            data: homeworkFormated
        };
    }
    async getAllHomework() {
        const homeworks = await this.prisma.homework.findMany();
        return {
            success: true,
            data: homeworks
        };
    }
    async getHomeworkResults(groupId, homeworkId, status) {
        let studentsResult;
        if (status == client_1.HomeworkStatus.PENDING) {
            studentsResult = await this.prisma.homeworkAnswerStudent.findMany({
                where: {
                    homework_id: homeworkId,
                    homeworkStatus: client_1.HomeworkStatus.PENDING
                }, select: {
                    created_at: true,
                    students: {
                        select: {
                            id: true,
                            full_name: true,
                        }
                    }
                }
            });
        }
        else if (status == client_1.HomeworkStatus.ACCEPTED || status == client_1.HomeworkStatus.REJECTED) {
            studentsResult = await this.prisma.homeworkResult.findMany({
                where: {
                    homework_id: homeworkId,
                    group_id: groupId,
                    homeworkStatus: status
                }, select: {
                    homeworkAnswerStudent: {
                        select: {
                            created_at: true,
                            students: {
                                select: {
                                    id: true,
                                    full_name: true,
                                }
                            }
                        }
                    }
                }
            });
        }
        let topshirganTalabalar = await this.prisma.homeworkAnswerStudent.findMany({
            where: {
                homework_id: homeworkId,
            }
        });
        let topshirganTalabalarId = topshirganTalabalar.map(el => el.student_id);
        const topshirilmaganTalabalar = await this.prisma.studentGroup.findMany({
            where: {
                group_id: groupId,
                student_id: {
                    notIn: topshirganTalabalarId,
                }
            }, select: {
                students: {
                    select: {
                        id: true,
                        full_name: true
                    }
                }
            }
        });
        if (!status) {
            return {
                success: true,
                data: topshirilmaganTalabalar.map(el => el.students)
            };
        }
        return {
            success: true,
            data: {
                students: status == "PENDING" ? studentsResult.map(el => ({ ...el.students, created_at: el.created_at })) : studentsResult.map(el => ({ ...el.homeworkAnswerStudent.students, created_at: el.homeworkAnswerStudent.created_at }))
            }
        };
    }
    async getGroupHomeworkStudentResult(groupId, homeworkId, studentId, lessonId) {
        const studentResult = await this.prisma.homeworkAnswerStudent.findFirst({
            where: {
                homework_id: homeworkId,
                student_id: studentId
            }, select: {
                id: true,
                file: true,
                title: true,
                created_at: true,
                students: {
                    select: {
                        id: true,
                        full_name: true,
                    }
                }
            }
        });
        const homework = await this.prisma.homework.findFirst({
            where: {
                id: homeworkId
            }, select: {
                id: true,
                file: true,
                title: true,
            }
        });
        let lessons = await this.prisma.lesson.findFirst({
            where: {
                group_id: groupId,
                id: lessonId
            },
            select: {
                homework: {
                    where: {
                        id: homeworkId
                    },
                    select: {
                        homeworkAnswerStudents: {
                            where: {
                                student_id: studentId
                            },
                            select: {
                                homeworkResults: {
                                    select: {
                                        homeworkStatus: true,
                                        title: true,
                                        grade: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        let status;
        if (lessons.homework.length === 0) {
            status = "Berilmagan";
        }
        else if (lessons.homework[0]?.homeworkAnswerStudents[0]?.homeworkStatus == client_1.HomeworkStatus.PENDING) {
            status = "Kutilmoqda";
        }
        else if (lessons.homework[0]?.homeworkAnswerStudents[0]?.homeworkResults[0]?.homeworkStatus == client_1.HomeworkStatus.ACCEPTED) {
            status = "Qabul qilingan";
        }
        else if (lessons.homework[0]?.homeworkAnswerStudents[0]?.homeworkResults[0]?.homeworkStatus == client_1.HomeworkStatus.REJECTED) {
            status = "Qaytarilgan";
        }
        else {
            status = "Bajarilmagan";
        }
        return {
            success: true,
            data: {
                ...studentResult,
                homework,
                homeworkResult: lessons.homework[0]?.homeworkAnswerStudents[0]?.homeworkResults[0],
                status
            }
        };
    }
    async getGroupHomework(groupId, currentUser) {
        const group = await this.prisma.group.findMany({
            where: {
                id: groupId
            },
            include: {
                lessons: {
                    select: {
                        id: true,
                        topic: true,
                        created_at: true,
                        homework: {
                            select: {
                                id: true,
                                created_at: true,
                            }
                        }
                    },
                    orderBy: {
                        created_at: "desc"
                    }
                }
            }
        });
        const existStudentsIngroup = await this.prisma.studentGroup.count({
            where: { group_id: groupId }
        });
        const lessons = group[0].lessons;
        const groupFormated = await Promise.all(lessons.flatMap(lesson => lesson.homework.map(async (hw) => {
            const pendingCount = await this.prisma.homeworkAnswerStudent.count({
                where: {
                    homework_id: hw.id,
                    homeworkStatus: client_1.HomeworkStatus.PENDING
                },
            });
            const acceptCount = await this.prisma.homeworkResult.count({
                where: {
                    homework_id: hw.id,
                    group_id: groupId,
                    homeworkStatus: client_1.HomeworkStatus.ACCEPTED
                }
            });
            const rejectCount = await this.prisma.homeworkResult.count({
                where: {
                    homework_id: hw.id,
                    group_id: groupId,
                    homeworkStatus: client_1.HomeworkStatus.REJECTED
                }
            });
            return {
                id: lesson.id,
                topic: lesson.topic,
                created_at: lesson.created_at,
                homework: [hw],
                homeworkPending: pendingCount,
                homeworkAccept: acceptCount,
                homeworkReject: rejectCount,
                existStudentsIngroup: existStudentsIngroup
            };
        })));
        return {
            success: true,
            data: groupFormated
        };
    }
    async createHomework(payload, currentUser, filename) {
        const existLesson = await this.prisma.lesson.findFirst({
            where: {
                id: payload.lesson_id
            },
            select: {
                groups: {
                    select: {
                        GroupTeacher: {
                            select: {
                                teacher_id: true
                            }
                        }
                    }
                }
            }
        });
        if (!existLesson) {
            throw new common_1.NotFoundException("Lesson not fount with this id");
        }
        if (currentUser.role == client_1.Role.TEACHER && !existLesson.groups.GroupTeacher.some(gt => gt.teacher_id == currentUser.id)) {
            throw new common_1.ForbiddenException("Is not your lesson");
        }
        await this.prisma.homework.create({
            data: {
                ...payload,
                file: filename,
                teacher_id: currentUser.role == "TEACHER" ? currentUser.id : null,
                user_id: currentUser.role != "TEACHER" ? currentUser.id : null
            }
        });
        return {
            success: true,
            message: "Homework recorded"
        };
    }
    async checkHomeworkResult(payload, currentUser, groupId, homeworkId) {
        await this.prisma.homeworkResult.create({
            data: {
                homework_answer_id: payload.homework_answer_id,
                group_id: groupId,
                homework_id: homeworkId,
                grade: payload.grade,
                homeworkStatus: payload.grade > 60 ? client_1.HomeworkStatus.ACCEPTED : client_1.HomeworkStatus.REJECTED,
                title: payload.title,
                teacher_id: currentUser.role == client_1.Role.TEACHER ? currentUser.id : null,
                user_id: currentUser.role != client_1.Role.TEACHER ? currentUser.id : null,
            }
        });
        await this.prisma.homeworkAnswerStudent.update({
            where: {
                id: payload.homework_answer_id
            },
            data: {
                homeworkStatus: client_1.HomeworkStatus.CHECKED,
            }
        });
        return {
            success: true,
            message: "Homework recorded"
        };
    }
};
exports.HomeworkService = HomeworkService;
exports.HomeworkService = HomeworkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HomeworkService);
//# sourceMappingURL=homework.service.js.map