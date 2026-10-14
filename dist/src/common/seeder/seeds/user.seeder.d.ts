import { PrismaService } from "../../../core/database/prisma.service";
export declare class UserSeeder {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    seedUsers(): Promise<void>;
}
