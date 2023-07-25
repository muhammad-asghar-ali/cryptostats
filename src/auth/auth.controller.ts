import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from 'src/common';
import { UserResponse } from 'src/users';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
    constructor(private readonly _svc: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    public async login(
        @CurrentUser() user: UserResponse,
        @Res({passthrough: true}) response: Response 
    ): Promise<void> {
        await this._svc.login(user, response);
        response.send(user);
    }
}
