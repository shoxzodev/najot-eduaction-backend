import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateStudentDto } from './dto/create.dto';
import * as bcrypt from "bcrypt"
import { Status, StudentStatus } from '@prisma/client';
import { EmailService } from 'src/common/email/email.service';
import { PaginationDto } from './dto/pagination.dto';
import { CreateHomeworkAnswerDto } from './dto/create.homework.dto';

@Injectable()
export class StudentsService {
    constructor(
        private prisma : PrismaService,
        private emailService : EmailService
    ){}

    async getMyGroups(currentUser : { id : number}){
        const myGroups = await this.prisma.studentGroup.findMany({
            where:{
                student_id: currentUser.id
            },
            select:{
                groups:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            }
        })

        return {
            success : true,
            data: myGroups.map(el => el.groups)
        }
    }

    async getAllStudents(pagination : PaginationDto){
        //pagination
        const {page,limit} = pagination
        const students = await this.prisma.student.findMany({
            where:{
                status:Status.active
            },
            select:{
                id:true,
                full_name:true,
                phone:true,
                photo:true,
                email:true,
                address:true,
                birth_date:true,
                created_at:true,
                studentGroups:{
                    select:{
                        groups:{
                            select:{
                                id:true,
                                name:true
                            }
                        }
                    }
                }
            },
            skip:(limit? +limit : 10) * (page ? +page - 1 : 0),
            take:limit? +limit : 10
        })

        const formattedStudents = students.map(student => {
            return {
                id:student.id,
                full_name:student.full_name,
                phone:student.phone,
                photo:student.photo,
                email:student.email, 
                address:student.address,
                birth_date:student.birth_date,
                created_at:student.created_at, 
                groups:student.studentGroups.map(group => group.groups)
            }
        })

        return {
            success:true,
            data:formattedStudents
        }
    }

    async getArchiveStudents(){
        const students = await this.prisma.student.findMany({
            where:{
                status:StudentStatus.inactive
            },
            select:{
                id:true,
                full_name:true,
                phone:true,
                photo:true,
                email:true,
                address:true,
                birth_date:true,
                created_at:true,
                studentGroups:{
                    select:{
                        groups:{
                            select:{
                                id:true,
                                name:true
                            }
                        }
                    }
                }
            }
        })

        const formattedStudents = students.map(student => {
            return {
                id:student.id,
                full_name:student.full_name,
                phone:student.phone,
                photo:student.photo,
                email:student.email, 
                address:student.address,
                birth_date:student.birth_date,
                created_at:student.created_at, 
                groups:student.studentGroups.map(group => group.groups)
            }
        })

        return {
            success:true,
            data:formattedStudents
        }
    }

    async createStudent(payload : CreateStudentDto, filename? : string){

        const existStudent = await this.prisma.student.findFirst({
            where:{
                OR:[
                    {phone:payload.phone},
                    {email:payload.email}
                ]
            }
        })

        if(existStudent){

            throw new ConflictException()
        }

        const existGroups = await this.prisma.group.findMany({
            where:{
                id:{
                    in:payload.groups
                }
            }
        })

        if(existGroups.length !== payload.groups?.length){
            throw new ConflictException("Group not found")
        } 

        const hashPass = await bcrypt.hash(payload.password,10)

        await this.prisma.student.create({
            data:{
                full_name:payload.full_name,
                photo:filename ?? null,
                phone:payload.phone,
                birth_date:new Date(payload.birth_date),
                email:payload.email,
                password:hashPass,
                address:payload.address,
                studentGroups: payload.groups?.length ? {
                    create:payload.groups?.map(gId => ({group_id : gId}))
                } : undefined
            }
        })

        // await this.emailService.sendEmail(payload.email,payload.phone,payload.password)

        return {
            success:true,
            message:"Student created"
        }
    }

    async createHomeworkAnswer(homeworkId : number, user : {id : number}, payload : CreateHomeworkAnswerDto, filename? : string){
        console.log(payload)
        const existHomework = await this.prisma.homework.findFirst({
            where:{
                id:homeworkId 
            }
        })

        if(!existHomework){
            throw new ConflictException("Homework not found")
        } 

        const existHomeworkAnswer = await this.prisma.homeworkAnswerStudent.findFirst({
            where:{
                homework_id:homeworkId,
                student_id:user.id
            }
        })

        if(existHomeworkAnswer){
            throw new ConflictException("Homework answer already exists")
        }

        await this.prisma.homeworkAnswerStudent.create({
            data:{
                homework_id:homeworkId,
                student_id:user.id,
                file:filename ?? null,
                title:payload.title,
            }
        })

        return {
            success:true,
            message:"Homework answer created"
        }
    }

    async deleteStudent(id:number){
        const existStudent = await this.prisma.student.findUnique({
            where:{id}
        })

        if(!existStudent) {
            throw new ConflictException("Student not found")
        }

        await this.prisma.student.update({
            where:{id},
            data:{status:StudentStatus.inactive}
        })
 
        return {
            success : true,
            message : "Student deleted"
        }
    }
}
