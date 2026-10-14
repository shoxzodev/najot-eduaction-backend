import { PrismaService } from "../../core/database/prisma.service";
import { CreateLessonDto } from './dto/create.lesson.dto';
import { Role } from '@prisma/client';
export declare class LessonsService {
    private prisma;
    constructor(prisma: PrismaService);
    getLessonHomeworks(groupId: number, lessonId: number, currentUser: {
        id: number;
    }): Promise<{
        success: boolean;
        data: never[];
    } | {
        success: boolean;
        data: {
            homework: {
                id: number;
                created_at: Date;
                title: string;
                file: string | null;
            };
            answer: null;
            result: null;
        };
    } | {
        success: boolean;
        data: {
            homework: {
                id: number;
                created_at: Date;
                title: string;
                file: string | null;
            };
            answer: {
                id: number;
                created_at: Date;
                title: string;
                file: string | null;
            };
            result?: undefined;
        };
    } | {
        success: boolean;
        data: {
            homework: {
                id: number;
                created_at: Date;
                title: string;
                file: string | null;
            };
            answer: {
                id: number;
                created_at: Date;
                title: string;
                file: string | null;
            };
            result: {
                id: number;
                grade: number;
                title: string;
                created_at: Date;
                homeworkStatus: import(".prisma/client").$Enums.HomeworkStatus;
                checker: string;
            };
        };
    }>;
    getLessonVideos(groupId: number, lessonId: number, currentUser: {
        id: number;
    }): Promise<{
        success: boolean;
        data: {
            id: number;
            created_at: Date;
            originalname: string;
            video_url: string;
        }[];
    }>;
    getMyGroupLessons(groupId: number, currentUser: {
        id: number;
    }): Promise<{
        success: boolean;
        data: {
            id: number;
            topic: string;
            created_at: Date;
        }[];
    }>;
    getAllLessons(): Promise<{
        sucess: boolean;
        data: {
            id: number;
            group_id: number;
            teacher_id: number | null;
            user_id: number | null;
            topic: string;
            description: string | null;
            status: import(".prisma/client").$Enums.Status;
            created_at: Date;
            update_at: Date;
        }[];
    }>;
    createLesson(payload: CreateLessonDto, currentUser: {
        id: number;
        role: Role;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
