import { PrismaService } from "../../core/database/prisma.service";
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from "../../common/redis/redis.service";
import { EskizService } from "../../common/service/sms";
import { UpdatePasswordDto } from './dto/update-password.dt';
import { VeifyOtpDto } from './dto/verify-otp.dto';
import { JwtGenerateToken } from "../../common/utils/jwt";
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private redisService;
    private eskizService;
    private jwtGenerateToken;
    constructor(prisma: PrismaService, jwtService: JwtService, redisService: RedisService, eskizService: EskizService, jwtGenerateToken: JwtGenerateToken);
    private otpGenerate;
    private sendOtp;
    private verifyPhoneOtp;
    userLogin(payload: LoginDto): Promise<{
        success: boolean;
        message: string;
        role: import(".prisma/client").$Enums.Role;
        accessToken: string;
        refreshToken: string;
    }>;
    sendOtpPhone(payload: {
        "phone": string;
    }): Promise<{
        success: boolean;
        message: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    changePassword(payload: UpdatePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOtp(payload: VeifyOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    refreshToken(payload: RefreshTokenDto): Promise<{
        success: boolean;
        message: string;
        accessToken: string;
    }>;
}
