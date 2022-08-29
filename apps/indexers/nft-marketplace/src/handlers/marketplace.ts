import { Store } from '@subsquid/typeorm-store';
import { Meta } from '../meta';
import config from '../config';
import {
  IAuctionCreated,
  IAuctionSettled,
  IBidAdded,
  IItemSold,
  IMarketPlaceDataAdded,
  IMessage,
  IOfferAccepted,
  IOfferAdded,
  IOfferCancelled,
  NftId,
} from '../types';
import { nftState } from '../state';
import { actionLog } from '../logger';
import { SubstrateBlock } from '@subsquid/substrate-processor';
import { indexNft } from '../indexNft';
import { Auction, NftContract, Token, Bid, Account, Transfer, Offer } from '../model';
import { getAcc } from './util';

const marketplaceMeta = new Meta(config.marketplace.meta);

export const marketplaceInit = marketplaceMeta.init();

export async function handleMarketplaceEvent(
  message: IMessage,
  store: Store,
  id: string,
  { timestamp, height }: SubstrateBlock,
) {
  if (message.reply?.exitCode !== 0) return;

  const payload = marketplaceMeta.decodeOut(message.payload);
  const variant = Object.keys(payload)[0];
  const innerPayload = payload[variant];

  const nftContract =
    typeof innerPayload === 'object' && 'nftContractId' in innerPayload
      ? await store.findOneBy(NftContract, { id: innerPayload.nftContractId })
      : undefined;

  const token =
    typeof innerPayload === 'object' && 'nftContractId' in innerPayload && 'tokenId' in innerPayload
      ? await store.findOne(Token, {
          where: { id: `${innerPayload.nftContractId}-${innerPayload.tokenId}` },
          relations: { owner: true },
        })
      : undefined;

  const variants: Record<string, Function> = {
    nftContractAdded: async (id: NftId) => {
      await nftState.add(id, store);
      actionLog(`NEW NFT_CONTRACT`, id);
      await indexNft(id, config.squid.startBlock, height - 1, store);
    },
    marketDataAdded: async ({ price }: IMarketPlaceDataAdded) => {
      token.isListed = true;
      if (price != null) {
        token.price = BigInt(price);
      }
      await store.save(token);
      actionLog(`MARKET DATA ADDED`, token.id);
    },
    itemSold: async ({ price }: IItemSold) => {
      const transfer = new Transfer({
        id,
        token,
        from: token.owner,
        to: await getAcc(message.destination, store),
        timestamp: BigInt(timestamp),
        price: BigInt(price),
      });

      // token.transfers.push(transfer);
      token.price = null;
      await store.save(token);
      await store.save(transfer);
      actionLog(`ITEM SOLD`, `${token.id}, price: ${price}`);
    },
    auctionCreated: async ({ ftContractId, price }: IAuctionCreated) => {
      const auction = new Auction({
        id,
        nftContract,
        token,
        ftContract: ftContractId,
        finishAt: BigInt(timestamp) + BigInt(0),
        price: BigInt(price),
        bids: [],
        isOpened: true,
      });
      await store.save(auction);
      actionLog(`AUCTION CREATED`, token.id);
    },
    bidAdded: async ({ price }: IBidAdded) => {
      const auction = await store.findOneBy(Auction, { nftContract });
      const bid = new Bid({ id, auction, price: BigInt(price) });
      auction.price = BigInt(price);
      // auction.bids.push(bid);
      await store.save(auction);
      await store.save(bid);
      actionLog(`BID ADDED`, `${token.id}, price: ${price}`);
    },
    auctionSettled: async ({ price, newOwner }: IAuctionSettled) => {
      const auction = await store.findOneBy(Auction, { nftContract });
      auction.price = BigInt(price);
      auction.isOpened = false;
      const owner = await store.findOneBy(Account, { id: newOwner });
      const transfer = new Transfer({
        id,
        token,
        from: token.owner,
        to: owner,
        timestamp: BigInt(timestamp),
        price: BigInt(price),
      });
      token.owner = await store.findOneBy(Account, { id: newOwner });
      // token.transfers.push(transfer);
      token.price = null;
      await store.save(token);
      await store.save(auction);
      await store.save(transfer);
      actionLog(`AUCTION SETTELED`, `${token.id}, price: ${price}`);
    },
    offerAdded: async ({ price }: IOfferAdded) => {
      const offer = new Offer({
        id,
        token,
        price: BigInt(price),
        accepted: false,
        cancelled: false,
        account: await getAcc(message.destination, store),
      });
      // token.offers.push(offer);
      await store.save(token);
      await store.save(offer);
      actionLog(`OFFER ADDED`, `${token.id}, price: ${price}`);
    },
    offerAccepted: async ({ newOwner, price }: IOfferAccepted) => {
      const offer = await store.findOneBy(Offer, { token, price: BigInt(price), account: { id: newOwner } });
      offer.accepted = true;
      token.owner = offer.account;
      await store.save(token);
      await store.save(offer);
      actionLog(`OFFER ACCEPTED`, `${token.id}, price: ${price}, owner: ${newOwner}`);
    },
    offerCancelled: async ({ price }: IOfferCancelled) => {
      const offer = await store.findOneBy(Offer, { token, price: BigInt(price), account: { id: message.destination } });
      offer.cancelled = true;
      await store.save(token);
      await store.save(offer);
      actionLog(`OFFER CANCELLED`, `${token.id}, price: ${price}, who: ${message.destination}`);
    },
  };

  if (variant in variants) {
    try {
      return await variants[variant](innerPayload);
    } catch (error) {
      console.log(token);
      console.log(payload);
      throw error;
    }
  } else {
    console.log(`Invalid variant: ${variant}`);
  }
}
