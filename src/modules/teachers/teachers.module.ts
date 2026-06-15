import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { EskizService } from 'src/common/service/sms';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService,EskizService] 
})
export class TeachersModule {}
