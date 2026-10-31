import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsDateString, IsEmail, IsOptional, IsString, Matches } from "class-validator"


export class CreateStudentDto {
    @ApiProperty()
    @IsString()
    full_name!: string

    @ApiProperty()
    @IsString()
    password!: string

    @ApiProperty()
    @Matches(/^(\+?998)(90|91|93|94|95|97|98|99|88|33|77)\d{7}$|^(\+?82)(10|11|16|17|18|19)\d{7,8}$/, {
            message: 'Invalid phone number. Supported countries: Uzbekistan (+998), South Korea (+82)',
    },)

    phone!: string

    @ApiProperty()
    @IsEmail()
    email!: string

    @ApiProperty()
    @IsDateString()
    birth_date!: string

    @ApiProperty()
    @IsString()
    address!: string

    @ApiProperty({ type: [Number], example: [1, 2, 3] })
    @IsOptional()
    @Transform(({ value }) => {
        if (!value) return [];
        if (typeof value === 'string') {
            return value.split(',').map((v) => Number(v.trim()));
        }
        if (Array.isArray(value)) {
            return value.map((v) => Number(v));
        }
        return [Number(value)];
    })
    groups?: number[];
}