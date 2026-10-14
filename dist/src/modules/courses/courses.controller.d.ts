import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create.dto';
import { UpdateCourseDto } from './dto/update.dto';
export declare class CoursesController {
    private readonly courseService;
    constructor(courseService: CoursesService);
    getAllCourses(): Promise<{
        success: boolean;
        data: {
            id: number;
            description: string | null;
            status: import(".prisma/client").$Enums.Status;
            created_at: Date;
            update_at: Date;
            name: string;
            price: import("@prisma/client/runtime/library").Decimal;
            duration_hours: number;
            duration_month: number;
        }[];
    }>;
    getArchiveCourses(): Promise<{
        success: boolean;
        data: {
            id: number;
            description: string | null;
            status: import(".prisma/client").$Enums.Status;
            created_at: Date;
            update_at: Date;
            name: string;
            price: import("@prisma/client/runtime/library").Decimal;
            duration_hours: number;
            duration_month: number;
        }[];
    }>;
    getOneCourse(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            description: string | null;
            status: import(".prisma/client").$Enums.Status;
            created_at: Date;
            update_at: Date;
            name: string;
            price: import("@prisma/client/runtime/library").Decimal;
            duration_hours: number;
            duration_month: number;
        };
    }>;
    createCourse(payload: CreateCourseDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteCourse(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    updateCourse(id: number, payload: UpdateCourseDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
