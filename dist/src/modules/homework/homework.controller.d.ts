import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create.dto';
import { HomeworkStatus } from '@prisma/client';
import { HomeworkResultDto } from './dto/homework.result.dto';
export declare class HomeworkController {
    private readonly homeworkService;
    constructor(homeworkService: HomeworkService);
    getOwnHomework(lessonId: number, req: Request): Promise<{
        success: boolean;
        data: ({
            id: number;
            title: string;
            file: string | null;
            created_at: Date;
            update_at: Date;
            user: {
                id: number;
                phone: string;
                photo: string | null;
                first_name: string;
                last_name: string;
            } | null;
            teacher?: undefined;
        } | {
            id: number;
            title: string;
            file: string | null;
            created_at: Date;
            update_at: Date;
            teacher: {
                id: number;
                phone: string;
                photo: string | null;
                full_name: string;
            };
            user?: undefined;
        })[];
    }>;
    getHomeworkResults(groupId: number, homeworkId: number, status: HomeworkStatus): Promise<{
        success: boolean;
        data: {
            id: number;
            full_name: string;
        }[];
    } | {
        success: boolean;
        data: {
            students: any;
        };
    }>;
    getGroupHomeworkStudentResult(groupId: number, lessonId: number, homeworkId: number, studentId: number): Promise<{
        success: boolean;
        data: {
            homework: {
                id: number;
                title: string;
                file: string | null;
            } | null;
            homeworkResult: any;
            status: any;
            id?: number | undefined;
            created_at?: Date | undefined;
            title?: string | undefined;
            file?: string | null | undefined;
            students?: {
                id: number;
                full_name: string;
            } | undefined;
        };
    }>;
    getAllHomework(): Promise<{
        success: boolean;
        data: {
            id: number;
            group_id: number;
            teacher_id: number | null;
            user_id: number | null;
            created_at: Date;
            update_at: Date;
            lesson_id: number;
            title: string;
            file: string | null;
        }[];
    }>;
    getGroupHomework(groupId: number, req: Request): Promise<{
        success: boolean;
        data: {
            id: number;
            topic: string;
            created_at: Date;
            homework: {
                id: number;
                created_at: Date;
            }[];
            homeworkPending: number;
            homeworkAccept: number;
            homeworkReject: number;
            existStudentsIngroup: number;
        }[];
    }>;
    createHomework(req: Request, payload: CreateHomeworkDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
    submitHomeworkResult(groupId: number, homeworkId: number, payload: HomeworkResultDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
}
