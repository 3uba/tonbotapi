import { createHash } from 'crypto';
import { Address } from 'ton';
import nacl from 'tweetnacl';

interface Domain {
  LengthBytes: number;
  Value: string;
}

interface ParsedMessage {
  Workchain: number;
  Address: Buffer;
  Timestamp: number;
  Domain: Domain;
  Signature: Buffer;
  Payload: string;
  StateInit: string;
}

export function SignatureVerify(pubkey: Buffer, message: Buffer, signature: Buffer): boolean {
  return nacl.sign.detached.verify(message, signature, pubkey);
}

const tonProofPrefix = 'ton-proof-item-v2/';
const tonConnectPrefix = 'ton-connect';

export async function CreateMessage(message: ParsedMessage): Promise<Buffer> {
  const wc = Buffer.alloc(4);
  wc.writeUInt32BE(message.Workchain);

  const ts = Buffer.alloc(8);
  ts.writeBigUInt64LE(BigInt(message.Timestamp));

  const dl = Buffer.alloc(4);
  dl.writeUInt32LE(message.Domain.LengthBytes);

  const m = Buffer.concat([
    Buffer.from(tonProofPrefix),
    wc,
    message.Address,
    dl,
    Buffer.from(message.Domain.Value),
    ts,
    Buffer.from(message.Payload),
  ]);

  const messageHash = createHash('sha256').update(m).digest();

  const fullMes = Buffer.concat([
    Buffer.from([0xff, 0xff]),
    Buffer.from(tonConnectPrefix),
    messageHash,
  ]);

  const res = createHash('sha256').update(fullMes).digest();
  return Buffer.from(res);
}

export function ConvertTonProofMessage(walletInfo: any, tp: any): ParsedMessage {
  const address = Address.parse(walletInfo.account.address);

  const res: ParsedMessage = {
    Workchain: address.workChain,
    Address: address.hash,
    Domain: {
      LengthBytes: tp.proof.domain.lengthBytes,
      Value: tp.proof.domain.value,
    },
    Signature: Buffer.from(tp.proof.signature, 'base64'),
    Payload: tp.proof.payload,
    StateInit: walletInfo.account.walletStateInit,
    Timestamp: tp.proof.timestamp,
  };
  return res;
}