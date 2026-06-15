import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString } from "class-validator";

export class VeifyPhoneDto {
    @ApiProperty()
    @IsString()
    @IsPhoneNumber("UZ")
    phone: string

}