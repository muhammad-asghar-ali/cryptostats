import { Module } from '@nestjs/common';
import { CoinbaseController } from './coinbase.controller';
import { CoinbaseService } from './coinbase.service';

@Module({
  imports: [],
  controllers: [CoinbaseController],
  providers: [CoinbaseService],
})
export class CoinbaseModule {}
