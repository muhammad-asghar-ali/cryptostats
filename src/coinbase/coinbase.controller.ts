import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CoinbaseService } from './coinbase.service';

@Controller('coinbase')
export class CoinbaseController {
  constructor(private readonly coinbaseService: CoinbaseService) {}

  @Get('auth')
  @UseGuards(JwtAuthGuard)
  authoirze(@Res() response: Response): void {
    this.coinbaseService.authoirze(response);
  }
}
