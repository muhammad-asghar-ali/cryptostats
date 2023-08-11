import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CoinbaseAuthService } from './coinbase.auth.service';

@Injectable()
export class CoinbaseService {
  constructor(
    private readonly httpService: HttpService,
    private readonly coinbaseAuthService: CoinbaseAuthService
  ) {}

  public async getPrimaryAccountTransections(userId: string): Promise<any> {
    const primaryAccount = await this.getPrimaryAccount(userId);
    return this.getAccountTransections(primaryAccount.id, userId);
  }

  private async getPrimaryAccount(userId: string): Promise<any> {
    try {
      const response$ = this.httpService.get(
        'https://api.coinbase.com/v2/accounts',
        {
          headers: await this.getHeaders(userId),
        }
      );
      const response = await lastValueFrom(response$);
      return response.data.data.find((account) => account.primary);
    } catch (error) {
      throw error.response.data;
    }
  }

  private async getAccountTransections(accountId: string, userId: string) {
    try {
      const response$ = this.httpService.get(
        `https://api.coinbase.com/v2/accounts/${accountId}/transections`,
        {
          headers: await this.getHeaders(userId),
        }
      );
      const response = await lastValueFrom(response$);
      return response.data.data.find((account) => account.primary);
    } catch (error) {
      throw error.response.data;
    }
  }

  private async getHeaders(userId: string) {
    return {
      Authorization: `Bearer ${await this.coinbaseAuthService.getAccessToken(
        userId
      )}`,
    };
  }
}
