import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsMobilePhone, IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class CreateAdminDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    first_name!: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    last_name!: string

    @ApiProperty()
    @IsStrongPassword()
    password!: string

    @ApiProperty()
    @IsMobilePhone("uz-UZ")
    phone!: string

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email!: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address!: string
}