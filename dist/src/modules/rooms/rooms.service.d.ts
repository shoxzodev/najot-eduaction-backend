import { PrismaService } from "../../core/database/prisma.service";
import { CreateRoomDto } from './dto/create.dto';
import { UpdateRoomDto } from './dto/update.dto';
export declare class RoomsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllRooms(): Promise<{
        success: boolean;
        data: {
            id: number;
            status: import(".prisma/client").$Enums.Status;
            created_at: Date;
            update_at: Date;
            name: string;
            capacity: number;
        }[];
    }>;
    getArchiveRooms(): Promise<{
        success: boolean;
        data: {
            id: number;
            status: import(".prisma/client").$Enums.Status;
            created_at: Date;
            update_at: Date;
            name: string;
            capacity: number;
        }[];
    }>;
    getOneRoom(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            status: import(".prisma/client").$Enums.Status;
            created_at: Date;
            update_at: Date;
            name: string;
            capacity: number;
        };
    }>;
    createRoom(payload: CreateRoomDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteRoom(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    updateRoom(id: number, payload: UpdateRoomDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
