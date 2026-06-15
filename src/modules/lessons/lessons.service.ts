import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateLessonDto } from './dto/create.lesson.dto';
import { Role, Status } from '@prisma/client';

@Injectable()
export class LessonsService {
    constructor(private prisma: PrismaService) { }

    async getLessonHomeworks(groupId:number,lessonId: number, currentUser: { id: number }){

        const existStudent = await this.prisma.studentGroup.findFirst({
            where:{
                student_id : currentUser.id,
                group_id : groupId,
            } 
        })

        if(!existStudent){
            throw new ForbiddenException("Bu seni guruhing emas")
        }

        const existLesson = await this.prisma.lesson.findFirst({ 
            where:{
                id: lessonId,
                status: Status.active, 
                group_id : groupId
            } 
        })

        if(!existLesson){
            throw new NotFoundException("Lesson not found with this id")
        } 

        const lessonHomeworks = await this.prisma.homework.findMany({
            where:{
                lesson_id: lessonId,  
                group_id:groupId   
            },
            select:{ 
                id:true,
                file:true, 
                title:true,
                created_at:true
            } 
        }) 

        if(lessonHomeworks.length === 0){
            return {
                success : true,
                data: []
            } 
        } 

        const studentHomeworkAnswer = await this.prisma.homeworkAnswerStudent.findFirst({
            where:{
                student_id : currentUser.id,
                homework_id: lessonHomeworks[0].id 
            },
            select:{
                id:true,
                file:true,
                title:true,
                created_at:true,  
            }
        })

        if(!studentHomeworkAnswer){
            return {
                success:true,
                data:{
                    homework:lessonHomeworks[0],
                    answer:null,
                    result:null 
                }
            }
        }

        const homeworkResult = await this.prisma.homeworkResult.findFirst({
            where:{
                homework_answer_id: studentHomeworkAnswer.id  
            },
            select:{
                id:true,
                grade:true,
                title:true,
                created_at:true,
                homeworkStatus:true,
                teachers:{
                    select:{
                        full_name:true
                    }
                },
                users:{
                    select:{
                        first_name:true,
                        last_name:true, 
                    }
                }
            }
        })

        if(!homeworkResult){
            return {
                success:true,
                data:{
                    homework:{...lessonHomeworks[0]},
                    answer:{...studentHomeworkAnswer} ,
                } 
            }
        }else{
            return {
            success : true,
            data: {
                homework:{...lessonHomeworks[0]},
                answer:{...studentHomeworkAnswer},
                result:{
                    id:homeworkResult.id,
                    grade:homeworkResult.grade,
                    title:homeworkResult.title, 
                    created_at:homeworkResult.created_at,
                    homeworkStatus:homeworkResult.homeworkStatus,
                    checker:homeworkResult.teachers ? homeworkResult.teachers.full_name : homeworkResult?.users?.first_name + " " + homeworkResult?.users?.last_name,
                }
            } 
        }
        }
    }

    async getLessonVideos(groupId:number,lessonId: number, currentUser: { id: number }){
        const existLesson = await this.prisma.lesson.findFirst({
            where:{
                id: lessonId,
                status: Status.active, 
                group_id : groupId
            } 
        })

        if(!existLesson){
            throw new NotFoundException("Lesson not found with this id")
        } 

        const lessonVideos = await this.prisma.lessonVideo.findMany({
            where:{
                lesson_id: lessonId,     
            },
            select:{ 
                id:true,
                video_url:true, 
                originalname:true, 
                created_at:true
            }
        })

        return {
            success : true,
            data: lessonVideos
        }
    }

    async getMyGroupLessons(groupId : number, currentUser : { id : number }){
        const existGroup = await this.prisma.group.findFirst({
            where:{
                id: groupId,
                status : Status.active
            }
        })

        if(!existGroup){
            throw new NotFoundException("Group not found with this id")
        }

        const groupLessons = await this.prisma.lesson.findMany({
            where:{
                group_id : groupId,
                status: Status.active
            },
            select:{
                id:true,
                topic:true,  
                created_at:true
            },
            orderBy:{
                created_at:"desc"
            } 
        })

        return {
            success : true,
            data: groupLessons
        }
    }

    async getAllLessons(){
        const lessons = await this.prisma.lesson.findMany({
            where:{status:"active"}
        })

        return {
            sucess:true,
            data:lessons
        }
    }

    async createLesson(payload: CreateLessonDto, currentUser: { id: number, role: Role }) {

        const existGroup = await this.prisma.group.findFirst({
            where: {
                id: payload.group_id,
                status: Status.active
            },
            include: {
                GroupTeacher: true
            }
        })

        if (!existGroup) {
            throw new NotFoundException("Group not found with this id")
        }

        if (currentUser.role == "TEACHER" && !existGroup.GroupTeacher.some(gt => gt.teacher_id == currentUser.id)) {
            throw new ForbiddenException("Bu seni guruhing emas")
        }

        await this.prisma.lesson.create({
            data: {
                ...payload,
                teacher_id: currentUser.role == "TEACHER" ? currentUser.id : null,
                user_id: currentUser.role != "TEACHER" ? currentUser.id : null
            }
        })

        return {
            success: true,
            message: "Lesson created"
        }
    }
}
