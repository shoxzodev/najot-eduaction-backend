import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumberString, IsPhoneNumber, IsString } from "class-validator"

export class VeifyOtpDto{
    @ApiProperty()
    @IsString()
    @IsPhoneNumber("UZ")
    phone:string 

    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    otp:number 
} 