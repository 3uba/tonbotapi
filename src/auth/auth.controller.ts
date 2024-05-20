import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Account, ConnectAdditionalRequest, TonProofItemReplySuccess } from '@tonconnect/ui';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('generatePayload')
  async generatePayload(): Promise<ConnectAdditionalRequest | undefined> {
    return await this.authService.generatePayload();
  }

  @Post('checkProof')
  async checkProof(
    @Body('proof') proof: TonProofItemReplySuccess['proof'],
    @Body('account') account: Account
  ): Promise<string | undefined> {
    return await this.authService.checkProof(proof, account);
  }

  @Get('getAccountInfo')
  async getAccountInfo(
    @Headers('Authorization') accessToken: string,
    @Body('account') account: Account
  ) {
    return await this.authService.getAccountInfo(accessToken, account);
  }
}
