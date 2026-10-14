import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create.dto';
import { UpdateGroupDto } from './dto/update.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { filterDto } from './dto/search';
export declare class GroupsController {
    private readonly groupService;
    constructor(groupService: GroupsService);
    getLessonsByGroupId(groupId: number, req: Request): Promise<{
        id: number;
        topic: string;
        created_at: Date;
        homeworkId: number | null;
        videoCount: number;
    }[]>;
    getLessons(groupId: number, req: Request): Promise<any>;
    getGroupOne(groupId: number): Promise<{
        success: boolean;
        data: {
            id: number;
            created_at: Date;
            phone: string;
            email: string;
            birth_date: Date;
            photo: string | null;
            full_name: string;
        }[];
    }>;
    getArchiveGroups(): Promise<{
        success: boolean;
        data: {
            id: number;
            created_at: Date;
            name: string;
            start_date: Date;
            start_time: string;
            max_student: number;
            week_day: string[];
            courses: {
                id: number;
                name: string;
                duration_month: number;
            };
            rooms: {
                id: number;
                name: string;
            };
        }[];
    }>;
    getOneGroup(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            start_date: Date;
            start_time: string;
            week_day: string[];
            course: {
                name: string;
                duration_month: number;
            };
            room: string;
            teachers: {
                id: number;
                full_name: string;
            }[];
            student_count: number;
            students: {
                id: number;
                full_name: string;
            }[];
        };
    }>;
    getAllGroups(search: filterDto): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            start_date: Date;
            start_time: string;
            week_day: string[];
            course: {
                name: string;
                duration_month: number;
            };
            room: string;
            teachers: {
                id: number;
                full_name: string;
            }[];
            student_count: number;
            students: {
                id: number;
                full_name: string;
            }[];
        }[];
    }>;
    createGroup(payload: CreateGroupDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            description: string | null;
            status: import(".prisma/client").$Enums.GroupStatus;
            created_at: Date;
            update_at: Date;
            name: string;
            course_id: number;
            room_id: number;
            start_date: Date;
            start_time: string;
            max_student: number;
            week_day: string[];
        };
    }>;
    getSchedules(groupId: number): Promise<{}[]>;
    createLesson(groupId: number, payload: CreateLessonDto): Promise<{
        success: boolean;
        message: string;
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
        };
    }>;
    getLessonByDate(groupId: number, date: string): Promise<{
        success: boolean;
        data: {
            lesson: {
                id: number;
                topic: string;
                description: string | null;
                created_at: Date;
            } | null;
            attendance: {
                student_id: number;
                full_name: string;
                photo: string | null;
                isPresent: boolean;
            }[];
        };
    }>;
    getGroupById(groupId: number): Promise<{
        success: boolean;
        data: {
            student_count: number;
            teachers: {
                id: number;
                photo: string | null;
                full_name: string;
            }[];
            averageAge: number;
            course: {
                id: number;
                name: string;
                duration_month: number;
            } | undefined;
            room_capacity: number | undefined;
        };
    }>;
    deleteGroup(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    updateGroup(id: number, payload: UpdateGroupDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllGroupUsers(): Promise<{
        success: boolean;
        data: string;
    }>;
}
