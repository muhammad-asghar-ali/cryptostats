import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { EncryptionService } from 'src/auth/encryption.service';
import { Coinbase } from 'src/models/coinbase.model';
import { UserResponse, UsersService } from 'src/users';
import { TokenPaylaod } from './dto/token.payload.dto';

@Injectable()
export class CoinbaseAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UsersService,
    private readonly encryptionService: EncryptionService
  ) {}
  public authoirze(res: Response): void {
    return res.redirect(this.buildAuthorizeUrl().href);
  }

  private buildAuthorizeUrl() {
    const authorizeUrl = new URL('https://coinbase.com/oauth/authorize');
    authorizeUrl.searchParams.append('response_type', 'code');
    authorizeUrl.searchParams.append(
      'client_id',
      this.configService.get('COINBASE_CLIENT_ID')
    );
    authorizeUrl.searchParams.append(
      'redirect_uri',
      this.configService.get('COINBASE_REDIRECT_URI')
    );
    authorizeUrl.searchParams.append(
      'scope',
      'wallet:transactions:read, wallet:accounts:read'
    );

    return authorizeUrl;
  }

  public handleCallback(req: Request, res: Response): void {
    const { code } = req.query;
    const { user } = req;

    this.getTokensFromCode(code as string).subscribe(async (tokenResponse) => {
      await this.updateUserCoinbase(
        tokenResponse.data,
        (user as unknown as UserResponse)._id
      );
      res.redirect(this.configService.get('AUTH_REDIRECT_URI'));
    });
  }

  private getTokensFromCode(code: string) {
    return this.httpService.post('https://api.coinbase.com/oauth/token', {
      grant_type: 'authorization_code',
      code,
      client_id: this.configService.get('COINBASE_CLIENT_ID'),
      client_secret: this.configService.get('COINBASE_CLIENT_SECRET'),
      redirect_uri: this.configService.get('COINBASE_REDIRECT_URI'),
    });
  }

  private async updateUserCoinbase(tokenPaylaod: TokenPaylaod, userId: string) {
    const { access_token, refresh_token, expries_in } = tokenPaylaod;
    const expries = new Date();
    expries.setSeconds(expries.getSeconds() + expries_in);
    await this.userService.updateUser(userId, {
      coinbase: {
        access_token,
        refresh_token,
        expries,
      },
    });
  }

  public async getAccessToken(userId: string): Promise<string> {
    const coinbaseAuth = await this.userService.getCoinbaseAuth(userId);

    if (new Date().getTime() >= coinbaseAuth.expries.getTime()) {
      const response$ = this.refreshAccessToken(coinbaseAuth);
      const response = await lastValueFrom(response$);
      await this.updateUserCoinbase(response.data, userId);
      return response.data.access_token;
    }

    return this.encryptionService.decrypt(coinbaseAuth.access_token);
  }

  private refreshAccessToken(coinbase: Coinbase) {
    return this.httpService.post('https://www.coinbase.com/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: this.encryptionService.decrypt(coinbase.refresh_token),
      client_id: this.configService.get('COINBASE_CLIENT_ID'),
      client_secret: this.configService.get('COINBASE_CLIENT_SECRET'),
    });
  }
}
