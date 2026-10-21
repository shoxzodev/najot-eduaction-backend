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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const redis_service_1 = require("../../common/redis/redis.service");
const sms_1 = require("../../common/service/sms");
const jwt_2 = require("../../common/utils/jwt");
let AuthService = class AuthService {
    prisma;
    jwtService;
    redisService;
    eskizService;
    jwtGenerateToken;
    constructor(prisma, jwtService, redisService, eskizService, jwtGenerateToken) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.redisService = redisService;
        this.eskizService = eskizService;
        this.jwtGenerateToken = jwtGenerateToken;
    }
    otpGenerate() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }
    async sendOtp(phone) {
        const code = Number(this.otpGenerate());
        await this.redisService.set(phone, code);
        await this.eskizService.sendSms(phone, `Fixoo platformasida parolingizni tiklash uchun tasdiqlash kodi: ${code}. Kodni hech kimga bermang!`);
    }
    async verifyPhoneOtp(phone) {
        const isverify = await this.redisService.get(phone + "_verify");
        if (!isverify) {
            throw new common_1.UnauthorizedException("Otp not verified");
        }
    }
    async userLogin(payload) {
        const existUser = await this.prisma.user.findUnique({
            where: {
                phone: payload.phone
            }
        });
        if (!existUser) {
            const existStudent = await this.prisma.student.findUnique({
                where: {
                    phone: payload.phone
                }
            });
            if (!existStudent) {
                const existteacher = await this.prisma.teacher.findUnique({
                    where: {
                        phone: payload.phone
                    }
                });
                if (!existteacher) {
                    throw new common_1.UnauthorizedException("Invalid phone or password");
                }
                const isMatch = await bcrypt.compare(payload.password, existteacher.password);
                if (!isMatch) {
                    throw new common_1.UnauthorizedException("Invalid username or password");
                }
                return {
                    success: true,
                    message: "You're logged",
                    role: client_1.Role.TEACHER,
                    accessToken: this.jwtGenerateToken.generateAccessToken({ id: existteacher.id, phone: existteacher.phone, email: existteacher.email, role: client_1.Role.TEACHER }),
                    refreshToken: this.jwtGenerateToken.generateRefreshToken({ id: existteacher.id, phone: existteacher.phone, email: existteacher.email, role: client_1.Role.TEACHER })
                };
            }
            const isMatch = await bcrypt.compare(payload.password, existStudent.password);
            if (!isMatch) {
                throw new common_1.UnauthorizedException("Invalid username or password");
            }
            return {
                success: true,
                message: "You're logged",
                role: client_1.Role.STUDENT,
                accessToken: this.jwtGenerateToken.generateAccessToken({ id: existStudent.id, phone: existStudent.phone, email: existStudent.email, role: client_1.Role.STUDENT }),
                refreshToken: this.jwtGenerateToken.generateRefreshToken({ id: existStudent.id, phone: existStudent.phone, email: existStudent.email, role: client_1.Role.STUDENT })
            };
        }
        const isMatch = await bcrypt.compare(payload.password, existUser.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException("Invalid username or password");
        }
        return {
            success: true,
            message: "You're logged",
            role: existUser.role,
            accessToken: this.jwtGenerateToken.generateAccessToken({ id: existUser.id, email: existUser.email, phone: existUser.phone, role: existUser.role }),
            refreshToken: this.jwtGenerateToken.generateRefreshToken({ id: existUser.id, email: existUser.email, phone: existUser.phone, role: existUser.role })
        };
    }
    async sendOtpPhone(payload) {
        const code = Number(this.otpGenerate());
        const existUser = await this.prisma.user.findUnique({
            where: {
                phone: payload.phone
            }
        });
        if (!existUser) {
            const existStudent = await this.prisma.student.findUnique({
                where: {
                    phone: payload.phone
                }
            });
            if (!existStudent) {
                const existteacher = await this.prisma.teacher.findUnique({
                    where: {
                        phone: payload.phone
                    }
                });
                if (!existteacher) {
                    throw new common_1.UnauthorizedException("Phone not found");
                }
                await this.sendOtp(payload.phone);
                return {
                    success: true,
                    message: "Phone verified",
                    role: client_1.Role.TEACHER
                };
            }
            await this.sendOtp(payload.phone);
            return {
                success: true,
                message: "Phone verified",
                role: client_1.Role.STUDENT
            };
        }
        await this.sendOtp(payload.phone);
        return {
            success: true,
            message: "Phone verified",
            role: existUser.role
        };
    }
    async changePassword(payload) {
        const existUser = await this.prisma.user.findUnique({
            where: {
                phone: payload.phone
            }
        });
        if (!existUser) {
            const existStudent = await this.prisma.student.findUnique({
                where: {
                    phone: payload.phone
                }
            });
            if (!existStudent) {
                const existteacher = await this.prisma.teacher.findUnique({
                    where: {
                        phone: payload.phone
                    }
                });
                if (!existteacher) {
                    throw new common_1.UnauthorizedException("Phone not found");
                }
                const hashPass = await bcrypt.hash(payload.password, 10);
                await this.verifyPhoneOtp(payload.phone);
                await this.prisma.teacher.update({
                    where: {
                        phone: payload.phone
                    },
                    data: {
                        password: hashPass
                    }
                });
                return {
                    success: true,
                    message: "Password changed successfully",
                };
            }
            const hashPass = await bcrypt.hash(payload.password, 10);
            await this.verifyPhoneOtp(payload.phone);
            await this.prisma.student.update({
                where: {
                    phone: payload.phone
                },
                data: {
                    password: hashPass
                }
            });
            return {
                success: true,
                message: "Password changed successfully",
            };
        }
        const hashPass = await bcrypt.hash(payload.password, 10);
        await this.verifyPhoneOtp(payload.phone);
        await this.prisma.user.update({
            where: {
                phone: payload.phone
            },
            data: {
                password: hashPass
            }
        });
        return {
            success: true,
            message: "Password changed successfully",
        };
    }
    async verifyOtp(payload) {
        const existOtp = await this.redisService.get(payload.phone);
        if (!existOtp) {
            throw new common_1.UnauthorizedException("Otp expired");
        }
        if (existOtp !== payload.otp) {
            throw new common_1.UnauthorizedException("Invalid otp");
        }
        await this.redisService.del(payload.phone);
        await this.redisService.set(payload.phone + "_verify", 1);
        return {
            success: true,
            message: "Otp verified successfully",
        };
    }
    async refreshToken(payload) {
        const user = await this.jwtGenerateToken.verifyToken(payload.token);
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid token");
        }
        delete user.exp;
        delete user.iat;
        const accessToken = this.jwtGenerateToken.generateAccessToken(user);
        return {
            success: true,
            message: "Token refreshed successfully",
            accessToken
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        redis_service_1.RedisService,
        sms_1.EskizService,
        jwt_2.JwtGenerateToken])
], AuthService);
//# sourceMappingURL=auth.service.js.map