import { UsersService } from './users.service';
import { CreateAdminDto } from './dto/create.admin.dto';
import { ChangePersonalDataDto } from './dto/change.personal-data.dto';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getAllAdmins(): Promise<{
        success: boolean;
        data: {
            first_name: string;
            last_name: string;
            phone: string;
            email: string;
            id: number;
            role: import(".prisma/client").$Enums.Role;
            photo: string | null;
        }[];
    }>;
    createAdmin(payload: CreateAdminDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserInfo(req: Request): Promise<{
        success: boolean;
        user: {
            phone: string;
            email: string;
            full_name: string;
            id: number;
            photo: string | null;
        } | null;
        role: string;
        groups: any;
        group?: undefined;
    } | {
        success: boolean;
        user: {
            phone: string;
            email: string;
            full_name: string;
            id: number;
            photo: string | null;
        } | null;
        group: any;
        role?: undefined;
        groups?: undefined;
    } | {
        success: boolean;
        user: {
            first_name: string;
            last_name: string;
            email: string;
            id: number;
            role: import(".prisma/client").$Enums.Role;
            photo: string | null;
        } | null;
        role?: undefined;
        groups?: undefined;
        group?: undefined;
    }>;
    changeUserPersonalData(req: Request, payload: ChangePersonalDataDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
}
