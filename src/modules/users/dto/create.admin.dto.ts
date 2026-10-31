import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsMobilePhone, IsNotEmpty, IsString, IsStrongPassword, Matches } from "class-validator"

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
    @Matches(/^(\+?998)(90|91|93|94|95|97|98|99|88|33|77)\d{7}$|^(\+?82)(10|11|16|17|18|19)\d{7,8}$/, {
                message: 'Invalid phone number. Supported countries: Uzbekistan (+998), South Korea (+82)',
    },)

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