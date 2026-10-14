import { PrismaService } from "../../../core/database/prisma.service";
import { CreateStudentGroupDto } from './dto/create.dto';
export declare class StudentGroupService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllStudentGroup(): Promise<{
        sucess: boolean;
        data: {
            id: number;
            group_id: number;
            status: import(".prisma/client").$Enums.Status;
            created_at: Date;
            update_at: Date;
            student_id: number;
        }[];
    }>;
    createStudentGroup(payload: CreateStudentGroupDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
