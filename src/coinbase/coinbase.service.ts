import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class CoinbaseService {
  constructor(private readonly configService: ConfigService) {}
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
}
