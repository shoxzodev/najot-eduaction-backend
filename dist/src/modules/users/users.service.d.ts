import { PrismaService } from "../../core/database/prisma.service";
import { CreateAdminDto } from './dto/create.admin.dto';
import { ChangePersonalDataDto } from './dto/change.personal-data.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllAdmins(): Promise<{
        success: boolean;
        data: {
            id: number;
            first_name: string;
            last_name: string;
            role: import(".prisma/client").$Enums.Role;
            phone: string;
            email: string;
            photo: string | null;
        }[];
    }>;
    createAdmin(payload: CreateAdminDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserInfo(userData: {
        id: number;
        role: string;
    }): Promise<{
        success: boolean;
        user: {
            id: number;
            phone: string;
            email: string;
            photo: string | null;
            full_name: string;
        } | null;
        role: string;
        groups: any;
        group?: undefined;
    } | {
        success: boolean;
        user: {
            id: number;
            phone: string;
            email: string;
            photo: string | null;
            full_name: string;
        } | null;
        group: any;
        role?: undefined;
        groups?: undefined;
    } | {
        success: boolean;
        user: {
            id: number;
            first_name: string;
            last_name: string;
            role: import(".prisma/client").$Enums.Role;
            email: string;
            photo: string | null;
        } | null;
        role?: undefined;
        groups?: undefined;
        group?: undefined;
    }>;
    changeUserInfo(userData: {
        id: number;
        role: string;
    }, payload: ChangePersonalDataDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
}
