import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateTeacherDto } from './dto/create.dto';
import { UpdateTeacherDto } from './dto/update.dto';
import * as bcrypt from "bcrypt"
import { Status, TeacherGroupStatus } from '@prisma/client';
import { EskizService } from 'src/common/service/sms';

@Injectable()
export class TeachersService {
    constructor(
        private prisma : PrismaService,
        private smsService : EskizService 
    ){}

    async getAllTeachers(){
        const teachers = await this.prisma.teacher.findMany({
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
                created_at:true,
                GroupTeacher:{
                    select:{
                        Group:{
                            select:{
                                name:true
                            }
                        }
                    }
                }
            }
        })

        const dataFormatter = teachers.map(el => ({
            ...el,
            groups: el.GroupTeacher.map(gt => gt.Group.name)
        }))

        return {
            success:true,
            data:dataFormatter
        }
    }

    async getMyGroups(teacherId: number) {

        const groups = await this.prisma.group.findMany({
            where: {
                GroupTeacher:{
                    some:{
                        teacher_id:teacherId,
                        status:TeacherGroupStatus.active
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
        })

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
        }
    }

    async getArchiveTeachers(){
        const teachers = await this.prisma.teacher.findMany({
            where:{
                status:Status.inactive
            },
            select:{
                id:true,
                full_name:true,
                phone:true,
                photo:true,
                email:true,
                address:true,
                created_at:true,
                GroupTeacher:{
                    select:{
                        Group:{
                            select:{
                                name:true
                            }
                        }
                    }
                }
            }
        })

        const dataFormatter = teachers.map(el => ({
            ...el,
            groups: el.GroupTeacher.map(gt => gt.Group.name)
        }))

        return {
            success:true,
            data:dataFormatter
        }
    }

    async getOneTeacher(id: number) {
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
            throw new NotFoundException("Teacher not found");
        }

        const dataFormatter = {
            id:teacher.id,
            full_name:teacher.full_name,
            phone:teacher.phone,
            photo:teacher.photo,
            email:teacher.email,
            address:teacher.address,
            created_at:teacher.created_at,
            groups: teacher.GroupTeacher.map(gt => gt.Group.name)
        };

        return {
            success: true,
            data: dataFormatter
        };
    }

    async createTeacher(payload : CreateTeacherDto, filename? : string){

        const existTeacher = await this.prisma.teacher.findFirst({
            where:{
                OR:[
                    {phone:payload.phone},
                    {email:payload.email}
                ]
            }
        })

        if(existTeacher){

            throw new ConflictException()
        }

        const hashPass = await bcrypt.hash(payload.password,10)

        const { groups, ...teacherData } = payload;

        const existingGroups = await this.prisma.group.findMany({
            where: {
                id: {
                    in: groups
                },
                status:Status.active
            }
        })

        if(existingGroups.length != groups?.length){
            throw new NotFoundException("Group is not found or inactive with this id")
        }

        await this.prisma.teacher.create({
            data:{
                ...teacherData,
                photo:filename ?? null,
                password:hashPass,
                GroupTeacher: groups?.length ? {
                    create: groups?.map(id => ({ group_id: id }))
                } : undefined
            }
        })

        await this.smsService.sendSms(payload.phone[0] == "+" ? payload.phone : "+" + payload.phone, `NajotEdu kabinetingiz https://najotedu.softwareengineer.uz/login.\n Login: ${payload.phone} Parol: ${payload.password}}`)

        return {
            success:true,
            message:"Teacher created"
        }
    }

    async deleteTeacher(id:number){
        const existTeacher = await this.prisma.teacher.findUnique({
            where:{
                id,
                status:Status.active
            }
        })

        if(!existTeacher){
            throw new NotFoundException("Teacher not found")
        }

        await this.prisma.teacher.update({
            where:{
                id
            },
            data:{
                status:Status.inactive
            }
        })

        return {
            success:true,
            message:"Teacher deleted"
        }
    }

    async updateTeacher(id: number, payload: UpdateTeacherDto, filename?: string) {
        const existTeacher = await this.prisma.teacher.findUnique({
            where: { id }
        });

        if (!existTeacher) {
            throw new NotFoundException("Teacher not found");
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
                throw new ConflictException("Phone or email already exists");
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
                    status: Status.active
                }
            });

            if (existingGroups.length !== groups?.length) {
                throw new NotFoundException("Group is not found or inactive");
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
}
