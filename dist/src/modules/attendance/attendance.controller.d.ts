import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    getAllAttendance(): Promise<{
        seccess: boolean;
        data: {
            id: number;
            created_at: Date;
            update_at: Date;
            group_id: number;
            teacher_id: number | null;
            student_id: number;
            user_id: number | null;
            isPresent: boolean;
        }[];
    }>;
    createAttendance(payload: CreateAttendanceDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
}
