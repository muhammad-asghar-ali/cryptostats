import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EncryptionService } from './encryption.service';
import { JwtStartegy, LocalStartegy } from './strategies';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStartegy, JwtStartegy, EncryptionService],
  exports: [EncryptionService],
})
export class AuthModule {}
