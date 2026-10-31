import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsPhoneNumber, IsString, Matches } from "class-validator";

export class ChangePersonalDataDto {
    @ApiProperty({example:"example@gmail.com"})
    @IsEmail()
    email?:string
    
    @ApiProperty({example:"+998775507614"})
    @Matches(/^(\+?998)(90|91|93|94|95|97|98|99|88|33|77)\d{7}$|^(\+?82)(10|11|16|17|18|19)\d{7,8}$/, {
                message: 'Invalid phone number. Supported countries: Uzbekistan (+998), South Korea (+82)',
    },)
    phone?:string

    @ApiProperty({example:"x04041234"})
    @IsString()
    current_password?:string

    @ApiProperty({example:"x04041234"})
    @IsString()
    new_password?:string
}