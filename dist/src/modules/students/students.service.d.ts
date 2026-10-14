import { PrismaService } from "../../core/database/prisma.service";
import { CreateStudentDto } from './dto/create.dto';
import { UpdateStudentDto } from './dto/update.dto';
import { EmailService } from "../../common/email/email.service";
import { PaginationDto } from './dto/pagination.dto';
import { CreateHomeworkAnswerDto } from './dto/create.homework.dto';
import { EskizService } from "../../common/service/sms";
export declare class StudentsService {
    private prisma;
    private emailService;
    private smsService;
    constructor(prisma: PrismaService, emailService: EmailService, smsService: EskizService);
    getMyGroups(currentUser: {
        id: number;
    }): Promise<{
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
    createStudent(payload: CreateStudentDto, filename?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createHomeworkAnswer(homeworkId: number, user: {
        id: number;
    }, payload: CreateHomeworkAnswerDto, filename?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteStudent(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    updateStudent(id: number, payload: UpdateStudentDto, filename?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
