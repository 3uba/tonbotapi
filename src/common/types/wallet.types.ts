export interface Wallet {
    connectItems: {
      tonProof?: TonProofItemReplySuccess;
    };
    account: {
      address: string;
      chain: string;
      walletStateInit: string;
    };
  }
  
  export interface TonProofItemReplySuccess {
    proof: {
      domain: {
        lengthBytes: number;
        value: string;
      };
      signature: string;
      payload: string;
      timestamp: number;
    };
  }
  