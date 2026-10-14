import { UsersService } from './users.service';
import { CreateAdminDto } from './dto/create.admin.dto';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getAllAdmins(): Promise<{
        success: boolean;
        data: {
            id: number;
            phone: string;
            email: string;
            photo: string | null;
            first_name: string;
            last_name: string;
            role: import(".prisma/client").$Enums.Role;
        }[];
    }>;
    createAdmin(payload: CreateAdminDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
