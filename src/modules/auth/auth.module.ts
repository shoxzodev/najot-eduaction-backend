import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EskizService } from 'src/common/service/sms';
import { RedisService } from 'src/common/redis/redis.service';

@Module({
  imports:[
    JwtModule.register({
      secret:"shapltoli",
      signOptions:{
        expiresIn:"1h" 
      },
      global:true
    }) 
  ],
  controllers: [AuthController],
  providers: [AuthService,EskizService,RedisService]
})
export class AuthModule {}
