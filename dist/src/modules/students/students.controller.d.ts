import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create.dto';
import { UpdateStudentDto } from './dto/update.dto';
import { PaginationDto } from './dto/pagination.dto';
import { CreateHomeworkAnswerDto } from './dto/create.homework.dto';
export declare class StudentsController {
    private readonly studentService;
    constructor(studentService: StudentsService);
    getMyGroups(req: Request): Promise<{
        success: boolean;
        data: {
            groupName: string;
            courseName: string;
            teachersCount: number;
            startDate: Date;
            groupId: number;
            teachers: {
                full_name: string;
                role: string;
                week_day: string[];
                start_time: string;
                duration_hours: number;
            }[];
        }[];
    }>;
    getAllStudents(pagination: PaginationDto): Promise<{
        success: boolean;
        data: {
            id: number;
            full_name: string;
            phone: string;
            photo: string | null;
            email: string;
            address: string;
            birth_date: Date;
            created_at: Date;
            groups: {
                id: number;
                name: string;
            }[];
        }[];
    }>;
    getArchiveStudents(): Promise<{
        success: boolean;
        data: {
            id: number;
            full_name: string;
            phone: string;
            photo: string | null;
            email: string;
            address: string;
            birth_date: Date;
            created_at: Date;
            groups: {
                id: number;
                name: string;
            }[];
        }[];
    }>;
    getOneStudent(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            full_name: string;
            phone: string;
            photo: string | null;
            email: string;
            address: string;
            birth_date: Date;
            created_at: Date;
            groups: {
                id: number;
                name: string;
            }[];
        };
    }>;
    createStudent(payload: CreateStudentDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
    createHomeworkAnswer(homeworkId: number, payload: CreateHomeworkAnswerDto, req: Request, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteStudent(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    updateStudent(id: number, payload: UpdateStudentDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
}
