import { Body, Controller, Post, Put } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UpdatePasswordDto } from './dto/update-password.dt';
import { VeifyPhoneDto } from './dto/verify-phone.dto';
import { VeifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    @Post("login")
    userLogin(@Body() payload : LoginDto){
        return this.authService.userLogin(payload)
    }

    @Post("send-otp")
    verifyPhone(@Body() payload: VeifyPhoneDto){
        return this.authService.sendOtpPhone(payload)
    }   
 
    @Post("verify-otp") 
    verifyOtp(@Body() payload:VeifyOtpDto){
        return this.authService.verifyOtp(payload)
    }   
 
    @Put("change-password")
    changePassword(@Body() payload: UpdatePasswordDto){
        return this.authService.changePassword(payload)
    }    
}
  