import { PartialType } from "@nestjs/swagger";
import { CreateTeacherDto } from "./create.dto";

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {}
