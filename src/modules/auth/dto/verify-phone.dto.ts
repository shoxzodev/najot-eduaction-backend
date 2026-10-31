import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString, Matches } from "class-validator";

export class VeifyPhoneDto {
    @ApiProperty({example:"+998775507613"})
    @IsString()
    @Matches(/^(\+?998)(90|91|93|94|95|97|98|99|88|33|77)\d{7}$|^(\+?82)(10|11|16|17|18|19)\d{7,8}$/, {
            message: 'Invalid phone number. Supported countries: Uzbekistan (+998), South Korea (+82)',
    },)
    phone!: string
}