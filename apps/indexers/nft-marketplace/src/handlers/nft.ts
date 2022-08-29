import { Store } from '@subsquid/typeorm-store';
import { Meta } from '../meta';
import config from '../config';
import { IMessage, IToken, ITransfer } from '../types';
import { Account, NftContract, Token, Transfer } from '../model';
import { actionLog, errorLog } from '../logger';
import { getAcc } from './util';

const nftMeta = new Meta(config.nft.meta);

export const nftInit = nftMeta.init();

export async function handleNftEvent(message: IMessage, store: Store, eventId: string, ts: number) {
  if (message.reply?.exitCode !== 0) return;

  let payload;
  try {
    payload = nftMeta.decodeOut(message.payload);
  } catch (error) {
    errorLog(message.payload);
    return;
  }
  const variant = Object.keys(payload)[0];

  const nftContract = await store.findOneBy(NftContract, { id: message.source });
  const dbTokenId = `${message.source}-${payload[variant].tokenId}`;

  const variants: Record<string, Function> = {
    minted: async ({ tokenMetadata: { name, reference, media, description }, owner, tokenId }: IToken) => {
      const account = await getAcc(owner, store);
      await store.save(
        new Token({
          id: dbTokenId,
          tokenId: tokenId,
          name,
          reference,
          media,
          description,
          owner: account,
          nftContract,
          isListed: false,
          transfers: [],
          offers: [],
          burnt: false,
        }),
      );
      actionLog(`MINT`, dbTokenId);
    },
    burnt: async () => {
      const token = await store.findOneBy(Token, { id: dbTokenId });
      token.burnt = true;
      await store.save(token);
      actionLog('BURN', dbTokenId);
    },
    transfer: async ({ from, to }: ITransfer) => {
      const token = await store.findOneBy(Token, { id: dbTokenId });
      if (!token) {
        return;
        // throw new Error(`Token \`${id}\` not found`);
      }
      let [fromAcc, toAcc] = await Promise.all([getAcc(from, store), getAcc(to, store)]);
      token.owner = toAcc;
      const transfer = new Transfer({ token: token, from: fromAcc, to: toAcc, timestamp: BigInt(ts), id: eventId });
      // token.transfers.push(transfer);
      await store.save(token);
      await store.save(transfer);
      actionLog('TRANSFER', dbTokenId);
    },
  };

  if (variant in variants) {
    try {
      return await variants[variant](payload[variant]);
    } catch (error) {
      console.log(variant);
      throw error;
    }
  } else {
    console.log(`Invalid variant: ${variant}`);
  }
}
