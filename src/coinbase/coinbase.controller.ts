import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CurrentUser } from 'src/common';
import { UserResponse } from 'src/users';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CoinbaseAuthService } from './coinbase.auth.service';
import { CoinbaseService } from './coinbase.service';

@Controller('coinbase')
export class CoinbaseController {
  constructor(
    private readonly coinbaseAuthService: CoinbaseAuthService,
    private readonly coinbaseService: CoinbaseService
  ) {}

  @Get('auth')
  @UseGuards(JwtAuthGuard)
  authoirze(@Res() response: Response): void {
    this.coinbaseAuthService.authoirze(response);
  }

  @Get('auth/callback')
  @UseGuards(JwtAuthGuard)
  handleCallback(@Req() request: Request, @Res() response: Response) {
    this.coinbaseAuthService.handleCallback(request, response);
  }

  @Get('auth/callback')
  @UseGuards(JwtAuthGuard)
  getCoinbaseData(@CurrentUser() user: UserResponse): Promise<any> {
    return this.coinbaseService.getPrimaryAccountTransections(user._id);
  }
}
