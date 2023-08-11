import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users';
import { CoinbaseController } from './coinbase.controller';
import { CoinbaseAuthService } from './coinbase.auth.service';

@Module({
  imports: [HttpModule, AuthModule, UsersModule],
  controllers: [CoinbaseController],
  providers: [CoinbaseAuthService],
})
export class CoinbaseModule {}
