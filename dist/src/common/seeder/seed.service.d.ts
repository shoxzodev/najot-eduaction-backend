import { OnModuleInit } from '@nestjs/common';
import { UserSeeder } from './seeds/user.seeder';
export declare class SeederService implements OnModuleInit {
    private readonly userSeeder;
    private readonly logger;
    constructor(userSeeder: UserSeeder);
    onModuleInit(): Promise<void>;
}
