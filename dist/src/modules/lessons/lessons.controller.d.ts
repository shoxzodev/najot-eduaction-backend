import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create.lesson.dto';
export declare class LessonsController {
    private readonly lessonService;
    constructor(lessonService: LessonsService);
    getLessonVideos(groupId: number, lessonId: number, req: Request): Promise<{
        success: boolean;
        data: {
            id: number;
            created_at: Date;
            originalname: string;
            video_url: string;
        }[];
    }>;
    getMyGroupLessons(groupId: number, req: Request): Promise<{
        success: boolean;
        data: {
            id: number;
            topic: string;
            created_at: Date;
        }[];
    }>;
    getLessonHomeworks(groupId: number, lessonId: number, req: Request): Promise<{
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
    createLesson(payload: CreateLessonDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
}
