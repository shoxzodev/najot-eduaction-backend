import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UpdatePasswordDto } from './dto/update-password.dt';
import { VeifyPhoneDto } from './dto/verify-phone.dto';
import { VeifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    userLogin(payload: LoginDto): Promise<{
        success: boolean;
        message: string;
        role: import(".prisma/client").$Enums.Role;
        accessToken: string;
        refreshToken: string;
    }>;
    verifyPhone(payload: VeifyPhoneDto): Promise<{
        success: boolean;
        message: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    verifyOtp(payload: VeifyOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    refresh(payload: RefreshTokenDto): Promise<{
        success: boolean;
        message: string;
        accessToken: string;
    }>;
    changePassword(payload: UpdatePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
