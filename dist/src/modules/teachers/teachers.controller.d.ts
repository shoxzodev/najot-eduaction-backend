import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create.dto';
import { UpdateTeacherDto } from './dto/update.dto';
export declare class TeachersController {
    private readonly teacherService;
    constructor(teacherService: TeachersService);
    getAllTeachers(): Promise<{
        success: boolean;
        data: {
            groups: string[];
            phone: string;
            email: string;
            address: string;
            full_name: string;
            id: number;
            created_at: Date;
            photo: string | null;
            GroupTeacher: {
                Group: {
                    name: string;
                };
            }[];
        }[];
    }>;
    getMyGroups(req: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            start_date: Date;
            start_time: string;
            week_day: string[];
            status: import(".prisma/client").$Enums.GroupStatus;
            course: {
                name: string;
                duration_month: number;
            };
            room: string;
            student_count: number;
            students: {
                full_name: string;
                id: number;
            }[];
        }[];
    }>;
    getMyProfile(req: any): Promise<{
        success: boolean;
        data: {
            id: number;
            full_name: string;
            phone: string;
            photo: string | null;
            email: string;
            address: string;
            created_at: Date;
            groups: string[];
        };
    }>;
    getArchiveTeachers(): Promise<{
        success: boolean;
        data: {
            groups: string[];
            phone: string;
            email: string;
            address: string;
            full_name: string;
            id: number;
            created_at: Date;
            photo: string | null;
            GroupTeacher: {
                Group: {
                    name: string;
                };
            }[];
        }[];
    }>;
    getOneTeacher(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            full_name: string;
            phone: string;
            photo: string | null;
            email: string;
            address: string;
            created_at: Date;
            groups: string[];
        };
    }>;
    createTeacher(payload: CreateTeacherDto, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteTeacher(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    updateTeacher(id: number, payload: UpdateTeacherDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
}
