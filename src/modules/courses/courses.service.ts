import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create.dto';
import { UpdateCourseDto } from './dto/update.dto';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) { }

    async getAllCourses() {
        const courses = await this.prisma.course.findMany({
            where: { status: Status.active }
        })

        return {
            success: true,
            data: courses
        }
    }

    async getArchiveCourses(){
        const courses = await this.prisma.course.findMany({
            where:{status:Status.inactive}
        })

        return {
            success : true,
            data:courses
        }
    } 

    async getOneCourse(id: number) {
        const course = await this.prisma.course.findUnique({
            where: { id }
        });

        if (!course) {
            throw new NotFoundException("Course not found");
        }

        return {
            success: true,
            data: course
        };
    }

    async createCourse(payload: CreateCourseDto) {

        const existCourse = await this.prisma.course.findUnique({
            where: { name: payload.name }
        })

        if (existCourse) {
            throw new ConflictException("Course already exists")
        }

        await this.prisma.course.create({
            data: payload
        })

        return {
            success: true,
            message: "Course created"
        }
    }

    async deleteCourse(id:number) {
        const existCourse = await this.prisma.course.findUnique({
            where:{id}
        })
 
        if(!existCourse) {
            throw new ConflictException("Course not found")
        }

        await this.prisma.course.update({
            where:{id},
            data:{status:Status.inactive}
        })

        return {
            success : true,
            message : "Course deleted"
        }
    }

    async updateCourse(id: number, payload: UpdateCourseDto) {
        const existCourse = await this.prisma.course.findUnique({
            where: { id }
        });

        if (!existCourse) {
            throw new NotFoundException("Course not found");
        }

        if (payload.name) {
            const nameExist = await this.prisma.course.findUnique({
                where: { name: payload.name }
            });
            if (nameExist && nameExist.id !== id) {
                throw new ConflictException("Course already exists");
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
}
