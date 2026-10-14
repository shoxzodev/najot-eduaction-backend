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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../core/database/prisma.service");
let CoursesService = class CoursesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllCourses() {
        const courses = await this.prisma.course.findMany({
            where: { status: client_1.Status.active }
        });
        return {
            success: true,
            data: courses
        };
    }
    async getArchiveCourses() {
        const courses = await this.prisma.course.findMany({
            where: { status: client_1.Status.inactive }
        });
        return {
            success: true,
            data: courses
        };
    }
    async getOneCourse(id) {
        const course = await this.prisma.course.findUnique({
            where: { id }
        });
        if (!course) {
            throw new common_1.NotFoundException("Course not found");
        }
        return {
            success: true,
            data: course
        };
    }
    async createCourse(payload) {
        const existCourse = await this.prisma.course.findUnique({
            where: { name: payload.name }
        });
        if (existCourse) {
            throw new common_1.ConflictException("Course already exists");
        }
        await this.prisma.course.create({
            data: payload
        });
        return {
            success: true,
            message: "Course created"
        };
    }
    async deleteCourse(id) {
        const existCourse = await this.prisma.course.findUnique({
            where: { id }
        });
        if (!existCourse) {
            throw new common_1.ConflictException("Course not found");
        }
        await this.prisma.course.update({
            where: { id },
            data: { status: client_1.Status.inactive }
        });
        return {
            success: true,
            message: "Course deleted"
        };
    }
    async updateCourse(id, payload) {
        const existCourse = await this.prisma.course.findUnique({
            where: { id }
        });
        if (!existCourse) {
            throw new common_1.NotFoundException("Course not found");
        }
        if (payload.name) {
            const nameExist = await this.prisma.course.findUnique({
                where: { name: payload.name }
            });
            if (nameExist && nameExist.id !== id) {
                throw new common_1.ConflictException("Course already exists");
            }
        }
        await this.prisma.course.update({
            where: { id },
            data: payload
        });
        return {
            success: true,
            message: "Course updated"
        };
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map