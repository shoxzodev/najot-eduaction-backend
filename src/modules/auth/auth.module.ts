import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { RedisService } from 'src/common/redis/redis.service';
import { JwtGenerateToken } from 'src/common/utils/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService,RedisService,JwtGenerateToken]
})
export class AuthModule {}
