import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class ChangePersonalDataDto {
    @ApiProperty({example:"example@gmail.com"})
    @IsEmail()
    email?:string
    
    @ApiProperty({example:"+998775507614"})
    @IsPhoneNumber()
    phone?:string

    @ApiProperty({example:"x04041234"})
    @IsString()
    current_password?:string

    @ApiProperty({example:"x04041234"})
    @IsString()
    new_password?:string
}