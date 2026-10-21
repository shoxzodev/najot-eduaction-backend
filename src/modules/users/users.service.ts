import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateAdminDto } from './dto/create.admin.dto';
import * as bcrypt from "bcrypt"
import { Role, Status } from '@prisma/client';
import { ChangePersonalDataDto } from './dto/change.personal-data.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getAllAdmins(){
        const admins = await this.prisma.user.findMany({
            where:{
                status:Status.active,
                role: Role.ADMIN
            },
            select:{
                id:true,
                first_name:true,
                last_name:true,
                email:true,
                phone:true,
                photo:true,
                role:true,

            }
        })

        return {
            success:true,
            data:admins
        }
    }

    async createAdmin(payload : CreateAdminDto) {
        const adminExists = await this.prisma.user.findFirst({
            where:{
                OR:[
                    {phone:payload.phone},
                    {email:payload.email}
                ]
                
            }
        })

        if(adminExists) throw new ConflictException()

        const hashPass = await bcrypt.hash(payload.password,10)

        await this.prisma.user.create({
            data:{
                ...payload,
                role:Role.ADMIN,
                password:hashPass
            }
        })

        return {
            success:true,
            message:"create admin successfully"
        }
    }


// new feature ( you can now see the user data info ( for : admin | superadmin | teacher | student ) )
    async getUserInfo(userData:{id:number , role:string}) {
        if(userData.role == "TEACHER") {
            const teachers = this
                                .prisma
                                .teacher
                                .findUnique(
                                    {where:{id:userData.id}, select: {
                                        id:true,
                                        full_name:true,
                                        email:true,
                                        phone:true,
                                        photo:true
                                    }},
                                );

            const teacherGroup = this
                                .prisma
                                .groupTeacher
                                .findMany(
                                    {
                                        where:{teacher_id:userData.id},
                                        select:{
                                            Group:{

                                            }
                                        }
                                    });
            
            const main = await Promise.all([ teachers, teacherGroup ]);
        
            const normalizeGroup = main[1].reduce((acc:any , item) => {
                acc.push({
                    id:item.Group.course_id,
                    name:item.Group.name
                })

                return acc

            } , [])

            return {
                success:true,
                user:main[0],
                role:userData.role,
                groups:normalizeGroup
            }
        } else if( userData.role == "STUDENT" ) {
            const student = this.prisma.student.findUnique({where:{id:userData.id} , select : { 
                id:true,
                full_name:true,
                email:true,
                phone:true,
                photo:true
            }});

            const studentGroup = this.prisma.studentGroup.findMany({where:{
                id:userData.id
            },
            select: {
                groups: {
                    select: {
                        id:true,
                        name:true
                    }
                }
            }
        });

        const parallel = await Promise.all([student , studentGroup])
        const normalizeGroup = parallel[1].reduce((acc:any , item) => {
            acc.push({id:item.groups.id , name:item.groups.name})

            return acc
        } , [])

        return {
            success:true,
            user:parallel[0],
            group:normalizeGroup
        }
    } else if (userData.role == "ADMIN") {
        const admin = await this.prisma.user.findUnique({where:{id:userData.id} , select: {
            id:true,
            first_name:true,
            last_name:true,
            email:true,
            photo:true,
            role:true
        }});

        return {
            success:true,
            user:admin
        }
    } else {
        const superadmin = await this.prisma.user.findUnique({where:{id:userData.id} , select:{
            id:true,
            first_name:true,
            last_name:true,
            phone:true,
            email:true,
            photo:true,
            role:true
        }});

        return {
            success:true,
            user:superadmin
        }
    }
  }


  // new feature ( now user can change the personal info ):
  async changeUserInfo(userData:{id:number , role:string } , payload:ChangePersonalDataDto , file?: Express.Multer.File) {
    if(userData.role == "STUDENT") {
        const existStudent = await this.prisma.student.findUnique({where:{id:userData.id} , select:{
            email:true,
            password:true,
            photo:true,
            phone:true
        }});

        // password:
        const verifyPassword = bcrypt.compareSync( payload.current_password as string , existStudent?.password as string);

        if(!verifyPassword)
            throw new ConflictException("user's current password incorrect")

        const newPassword = bcrypt.hashSync(payload.new_password as string , 10);
        const image = Date.now() + "." + file?.mimetype.split("/")[1];

        try {
            await this.prisma.student.update({where:{id:userData.id} , data:{
                    email:payload.email ? payload.email : existStudent?.email,
                    phone:payload.phone ? payload.phone : existStudent?.phone,
                    password:payload.new_password ? newPassword : existStudent?.password,
                    photo: image ? image : payload.phone
                }})
            
            return {
                success:true,
                message:"user updated successfully"
            }
        } catch (err) {
            if(err instanceof Error && err.name == "PrismaClientKnownRequestError")
                throw new ConflictException("user's email or phone already exists")
        }

    } else if (userData.role == "TEACHER") {
        const existTeacher = await this.prisma.teacher.findUnique({where:{id:userData.id} , select:{
            email:true,
            password:true,
            photo:true,
            phone:true
        }});

        // password:
        const verifyPassword = bcrypt.compareSync( payload.current_password as string , existTeacher?.password as string);

        if(!verifyPassword)
            throw new ConflictException("user's current password incorrect")

        const newPassword = bcrypt.hashSync(payload.new_password as string , 10);
        const image = Date.now() + "." + file?.mimetype.split("/")[1];

        try {
            await this.prisma.student.update({where:{id:userData.id} , data:{
                    email:payload.email ? payload.email : existTeacher?.email,
                    phone:payload.phone ? payload.phone : existTeacher?.phone,
                    password:payload.new_password ? newPassword : existTeacher?.password,
                    photo: image ? image : payload.phone
                }})
            
            return {
                success:true,
                message:"user updated successfully"
            }
        } catch (err) {
            if(err instanceof Error && err.name == "PrismaClientKnownRequestError")
                throw new ConflictException("user's email or phone already exists")
        }
    } else {
        const existAdmin = await this.prisma.user.findUnique({where:{id:userData.id} , select:{
            email:true,
            password:true,
            photo:true,
            phone:true
        }});

        // password:
        const verifyPassword = bcrypt.compareSync( payload.current_password as string , existAdmin?.password as string);

        if(!verifyPassword)
            throw new ConflictException("user's current password incorrect")

        const newPassword = bcrypt.hashSync(payload.new_password as string , 10);
        const image = Date.now() + "." + file?.mimetype.split("/")[1];

        try {
            await this.prisma.student.update({where:{id:userData.id} , data:{
                    email:payload.email ? payload.email : existAdmin?.email,
                    phone:payload.phone ? payload.phone : existAdmin?.phone,
                    password:payload.new_password ? newPassword : existAdmin?.password,
                    photo: image ? image : payload.phone
                }})
            
            return {
                success:true,
                message:"user updated successfully"
            }
        } catch (err) {
            if(err instanceof Error && err.name == "PrismaClientKnownRequestError")
                throw new ConflictException("user's email or phone already exists")
        }
    }
  } 
}