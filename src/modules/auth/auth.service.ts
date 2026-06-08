import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async userLogin(payload: LoginDto) {
        const existUser = await this.prisma.user.findUnique({
            where: {
                phone: payload.phone
            }
        })

        if (!existUser) {
            const existStudent = await this.prisma.student.findUnique({
                where: {
                    phone: payload.phone
                }
            })
            if (!existStudent) {
                const existteacher = await this.prisma.teacher.findUnique({
                    where: {
                        phone: payload.phone
                    }
                })

                if(!existteacher){
                    throw new UnauthorizedException("Invalid phone or password")
                }

                const isMatch = await bcrypt.compare(payload.password, existteacher.password)
                if (!isMatch) {
                    throw new UnauthorizedException("Invalid username or password")
                }

                return {
                    success: true,
                    message: "You're logged",
                    role:Role.TEACHER,
                    accessToken: this.jwtService.sign({ id: existteacher.id, email: existteacher.email, role:Role.TEACHER })
                }
            }

            const isMatch = await bcrypt.compare(payload.password, existStudent.password)
            if (!isMatch) {
                throw new UnauthorizedException("Invalid username or password")
            }

            return {
                success: true,
                message: "You're logged",
                role:Role.STUDENT,
                accessToken: this.jwtService.sign({ id: existStudent.id, email: existStudent.email, role: Role.STUDENT })
            }

        }

        const isMatch = await bcrypt.compare(payload.password, existUser.password)
        if (!isMatch) {
            throw new UnauthorizedException("Invalid username or password")
        }
 
        return {
            success: true,
            message: "You're logged",
            role:existUser.role,
            accessToken: this.jwtService.sign({ id: existUser.id, email: existUser.email, role: existUser.role })
        }
    }

}
