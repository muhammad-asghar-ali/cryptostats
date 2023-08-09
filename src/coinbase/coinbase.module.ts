import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users';
import { CoinbaseController } from './coinbase.controller';
import { CoinbaseService } from './coinbase.service';

@Module({
  imports: [HttpModule, AuthModule, UsersModule],
  controllers: [CoinbaseController],
  providers: [CoinbaseService],
})
export class CoinbaseModule {}
