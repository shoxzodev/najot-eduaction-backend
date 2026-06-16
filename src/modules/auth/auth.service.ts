import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { RedisService } from 'src/common/redis/redis.service';
import { EskizService } from 'src/common/service/sms';
import { UpdatePasswordDto } from './dto/update-password.dt';
import { VeifyOtpDto } from './dto/verify-otp.dto';
import { JwtGenerateToken } from 'src/common/utils/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private redisService: RedisService,
        private eskizService: EskizService,
        private jwtGenerateToken: JwtGenerateToken
    ) { }

    private otpGenerate() {
        return Math.floor(1000 + Math.random() * 9000).toString()
    }

    private async sendOtp(phone: string) {
        const code = Number(this.otpGenerate());
        await this.redisService.set(phone, code)
        await this.eskizService.sendSms(phone, `Fixoo platformasida parolingizni tiklash uchun tasdiqlash kodi: ${code}. Kodni hech kimga bermang!`)
    }

    private async verifyPhoneOtp(phone:string) {
        const isverify = await this.redisService.get(phone + "_verify")

        if (!isverify) {
            throw new UnauthorizedException("Otp not verified")
        }
    } 

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

                if (!existteacher) {
                    throw new UnauthorizedException("Invalid phone or password")
                }

                const isMatch = await bcrypt.compare(payload.password, existteacher.password)
                if (!isMatch) {
                    throw new UnauthorizedException("Invalid username or password")
                }

                return {
                    success: true,
                    message: "You're logged",
                    role: Role.TEACHER, 
                    accessToken: this.jwtGenerateToken.generateAccessToken({ id: existteacher.id, email: existteacher.email, role: Role.TEACHER }),
                    refreshToken: this.jwtGenerateToken.generateRefreshToken({ id: existteacher.id, email: existteacher.email, role: Role.TEACHER })
                }
            }

            const isMatch = await bcrypt.compare(payload.password, existStudent.password)
            if (!isMatch) {
                throw new UnauthorizedException("Invalid username or password")
            }

            return {
                success: true,
                message: "You're logged",
                role: Role.STUDENT,
                accessToken: this.jwtGenerateToken.generateAccessToken({ id: existStudent.id, email: existStudent.email, role: Role.STUDENT }),
                refreshToken: this.jwtGenerateToken.generateRefreshToken({ id: existStudent.id, email: existStudent.email, role: Role.STUDENT })
            }

        }

        const isMatch = await bcrypt.compare(payload.password, existUser.password)
        if (!isMatch) {
            throw new UnauthorizedException("Invalid username or password")
        }

        return {
            success: true,
            message: "You're logged",
            role: existUser.role,
            accessToken: this.jwtGenerateToken.generateAccessToken({ id: existUser.id, email: existUser.email, role: existUser.role }),
            refreshToken: this.jwtGenerateToken.generateRefreshToken({ id: existUser.id, email: existUser.email, role: existUser.role })
        }
    }

    async sendOtpPhone(payload: { "phone": string }) {
        const code = Number(this.otpGenerate());
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
                if (!existteacher) {
                    throw new UnauthorizedException("Phone not found")
                }

                await this.sendOtp(payload.phone)
                return {
                    success: true,
                    message: "Phone verified",
                    role: Role.TEACHER
                }

            }

            await this.sendOtp(payload.phone)
            return {
                success: true,
                message: "Phone verified",
                role: Role.STUDENT
            }
        }

        await this.sendOtp(payload.phone)
        return {
            success: true,
            message: "Phone verified",
            role: existUser.role
        }
    }


    async changePassword(payload: UpdatePasswordDto) {
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

                if (!existteacher) {
                    throw new UnauthorizedException("Phone not found")
                }

                const hashPass = await bcrypt.hash(payload.password, 10)

                await this.verifyPhoneOtp(payload.phone) 

                await this.prisma.teacher.update({
                    where: {
                        phone: payload.phone
                    },
                    data: {
                        password: hashPass
                    }
                })

                return {
                    success: true,
                    message: "Password changed successfully",
                }

            }

            const hashPass = await bcrypt.hash(payload.password, 10)

            await this.verifyPhoneOtp(payload.phone)

            await this.prisma.student.update({
                where: {
                    phone: payload.phone
                },
                data: {
                    password: hashPass
                }
            })

            return {
                success: true,
                message: "Password changed successfully",
            }
        }

        const hashPass = await bcrypt.hash(payload.password, 10)

        await this.verifyPhoneOtp(payload.phone)

        await this.prisma.user.update({
            where: {
                phone: payload.phone
            },
            data: {
                password: hashPass
            }
        })

        return {
            success: true,
            message: "Password changed successfully",
        }

    }


    async verifyOtp(payload: VeifyOtpDto) {
        const existOtp = await this.redisService.get(payload.phone)

        if (!existOtp) {
            throw new UnauthorizedException("Otp expired")
        }

        if (existOtp !== payload.otp) {
            throw new UnauthorizedException("Invalid otp")
        }

        await this.redisService.del(payload.phone)
        await this.redisService.set(payload.phone + "_verify", 1)
        return {
            success: true,
            message: "Otp verified successfully",
        }
    }

    async refreshToken(payload: RefreshTokenDto) {
        const user = await this.jwtGenerateToken.verifyToken(payload.token)
        if(!user){
            throw new UnauthorizedException("Invalid token")
        } 

        delete user.exp
        delete user.iat  

        const accessToken = this.jwtGenerateToken.generateAccessToken(user)
        return {
            success: true,
            message: "Token refreshed successfully",
            accessToken
        }
         
    } 

}
