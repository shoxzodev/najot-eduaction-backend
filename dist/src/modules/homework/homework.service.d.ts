import { PrismaService } from "../../core/database/prisma.service";
import { CreateHomeworkDto } from './dto/create.dto';
import { HomeworkStatus, Role } from '@prisma/client';
import { HomeworkResultDto } from './dto/homework.result.dto';
export declare class HomeworkService {
    private prisma;
    constructor(prisma: PrismaService);
    getOwnHomework(lessonId: number, currentUser: {
        id: number;
    }): Promise<{
        success: boolean;
        data: ({
            id: number;
            title: string;
            file: string | null;
            created_at: Date;
            update_at: Date;
            user: {
                id: number;
                first_name: string;
                last_name: string;
                phone: string;
                photo: string | null;
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
    getAllHomework(): Promise<{
        success: boolean;
        data: {
            id: number;
            created_at: Date;
            update_at: Date;
            group_id: number;
            teacher_id: number | null;
            title: string;
            user_id: number | null;
            lesson_id: number;
            file: string | null;
        }[];
    }>;
    getHomeworkResults(groupId: number, homeworkId: number, status?: HomeworkStatus): Promise<{
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
    getGroupHomeworkStudentResult(groupId: number, homeworkId: number, studentId: number, lessonId: number): Promise<{
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
            students?: {
                id: number;
                full_name: string;
            } | undefined;
            title?: string | undefined;
            file?: string | null | undefined;
        };
    }>;
    getGroupHomework(groupId: number, currentUser: {
        id: number;
        role: Role;
    }): Promise<{
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
    createHomework(payload: CreateHomeworkDto, currentUser: {
        id: number;
        role: Role;
    }, filename?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    checkHomeworkResult(payload: HomeworkResultDto, currentUser: {
        id: number;
        role: Role;
    }, groupId: number, homeworkId: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
