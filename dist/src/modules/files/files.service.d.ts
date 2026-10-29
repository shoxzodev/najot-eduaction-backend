import { PrismaService } from "../../core/database/prisma.service";
export declare class FilesService {
    private prisma;
    constructor(prisma: PrismaService);
    getFiles(groupId: number): Promise<{
        lesson: {
            id: number;
            created_at: Date;
            topic: string;
        };
        id: number;
        created_at: Date;
        originalname: string;
        video_url: string;
        size_mb: number;
    }[]>;
    uploadFile(groupId: number, lessonId: number, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
}
