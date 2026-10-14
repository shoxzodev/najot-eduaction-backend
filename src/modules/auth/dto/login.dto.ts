import { ApiProperty } from "@nestjs/swagger"
import { IsString, Matches } from "class-validator"

export class LoginDto {
    @ApiProperty({example:"998975661099"})
    @Matches(/^\+998|998(?:90|91|93|94|95|97|98|99|88|33|77)\d{7}$/, {
        message: 'Invalid Uzbekistan phone number'
    })
    phone!:string

    @ApiProperty({example:"Benazir99!"})
    @IsString()
    password!:string
}