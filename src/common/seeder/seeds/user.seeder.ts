import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role, Status } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class UserSeeder {
  private readonly logger = new Logger(UserSeeder.name);

  constructor(private readonly prisma: PrismaService) {}

  async seedUsers(): Promise<void> {
    const phone = process.env.PHONE || '998975661099';
    const email = process.env.EMAIL || 'abdukhoshim99@gmail.com';
    const password = process.env.SUPERADMIN_PASSWORD || 'Benazir99!';

    this.logger.log(`Seeding SUPERADMIN with email ${email} and phone ${phone}`);
    const passwordHash = await bcrypt.hash(password, 10);

    const existSuperAdmin = await this.prisma.user.findUnique({ where: { phone } });

    if (existSuperAdmin) {
      this.logger.log(`SUPERADMIN already exists: ${existSuperAdmin.email}`);
      return;
    }

    const created = await this.prisma.user.create({
      data: {
        first_name: 'SUPERADMIN',
        last_name: 'SUPERADMIN',
        password: passwordHash,
        role: Role.SUPERADMIN, 
        phone,
        photo: 'superadmin.png',
        email,
        address: 'tashkent city',
        status: Status.active, 
      },
    });

    this.logger.log(`SUPERADMIN created: ${JSON.stringify(created)}`);
  }
}
