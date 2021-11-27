import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { RefreshTokenRecord, User } from './entities';
import { AuthService } from './auth.service';

@Module({
  imports: [
    {
      ...JwtModule.registerAsync({
        useFactory: (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
        }),
        inject: [ConfigService],
      }),
      global: true,
    },
    TypeOrmModule.forFeature([RefreshTokenRecord, User]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
