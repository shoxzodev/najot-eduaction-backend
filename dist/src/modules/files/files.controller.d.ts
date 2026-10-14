import { FilesService } from "./files.service";
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    getFiles(groupId: number): Promise<{
        lesson: {
            id: number;
            topic: string;
            created_at: Date;
        };
        id: number;
        created_at: Date;
        originalname: string;
        video_url: string;
        size_mb: number;
    }[]>;
    uploadFile(grupId: number, lessonId: number, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
}
