import { Injectable } from '@nestjs/common';
import { Account, ConnectAdditionalRequest, TonProofItemReplySuccess } from '@tonconnect/ui';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {
  private readonly baseURL = 'https://demo.tonconnect.dev';

  async generatePayload(): Promise<ConnectAdditionalRequest | undefined> {
    try {
      const response: AxiosResponse = await axios.post(`${this.baseURL}/ton-proof/generatePayload`);
      return { tonProof: response.data.payload };
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async checkProof(proof: TonProofItemReplySuccess['proof'], account: Account): Promise<string | undefined> {
    try {
      const requestBody = {
        address: account.address,
        network: account.chain,
        proof: {
          ...proof,
          state_init: account.walletStateInit
        }
      };

      const response: AxiosResponse = await axios.post(`${this.baseURL}/ton-proof/checkProof`, requestBody);
      return response.data?.token;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async getAccountInfo(accessToken: string, account: Account) {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseURL}/dapp/getAccountInfo?network=${account.chain}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
}
