import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString, Matches } from "class-validator";

export class VeifyPhoneDto {
    @ApiProperty({example:"+998775507613"})
    @IsString()
    @Matches(/^\+998|998(?:90|91|93|94|95|97|98|99|88|33|77)\d{7}$/, {
        message: 'Invalid Uzbekistan phone number'
    })    
    phone!: string
}