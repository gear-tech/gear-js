import { BatchContext, BatchProcessorItem, SubstrateBatchProcessor } from '@subsquid/substrate-processor';
import { Store, TypeormDatabase } from '@subsquid/typeorm-store';

import { BatchState } from './state';
import config from './config';
import { Meta } from './meta';
import {
  AuctionCreatedPayload,
  AuctionSettledPayload,
  BidAddedPayload,
  BurntPayload,
  ItemSoldPayload,
  MarketDataAddedPayload,
  MintedPayload,
  OfferAcceptedPayload,
  OfferAddedPayload,
  OfferCancelledPayload,
  TransferPayload,
} from './types';
import { indexNft } from './indexNft';

const nftMeta = new Meta(config.nft.meta);
const marketplaceMeta = new Meta(config.marketplace.meta);

export const nftInit = nftMeta.init();
export const marketplaceInit = marketplaceMeta.init();

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: config.squid.archiveUrl,
  })
  .setBlockRange({ from: config.squid.startBlock })
  .addEvent('Gear.UserMessageSent', {
    data: {
      event: { args: true },
    },
  });

const batchState = new BatchState();

async function handleEvent(ctx: BatchContext<Store, BatchProcessorItem<typeof processor>>) {
  batchState.newBatch(ctx.store);

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind != 'event') continue;
      if (item.event.name !== 'Gear.UserMessageSent') continue;

      const {
        event: {
          args: { message },
        },
      } = item;

      if (message.reply?.exitCode !== 0) continue;
      let payload: any;

      if (message.source === config.marketplace.id) {
        payload = marketplaceMeta.decodeOut(message.payload);
      } else if (await batchState.isNft(message.source)) {
        payload = nftMeta.decodeOut(message.payload);
      } else {
        continue;
      }

      const variant = Object.keys(payload)[0];
      const timestamp = block.header.timestamp;
      let data: any;
      switch (variant) {
        case 'minted':
          data = payload[variant] as MintedPayload;
          await batchState.mintToken({
            id: `${message.source}-${data.tokenId}`,
            owner: data.owner,
            nftContract: message.source,
            burnt: false,
            isListed: false,
            price: null,
            transfers: [],
            offers: [],
            tokenId: data.tokenId,
            auction: null,
            ...data.tokenMetadata,
          });
          break;
        case 'burnt':
          data = payload[variant] as BurntPayload;
          await batchState.burnToken({ tokenId: `${message.source}-${data.tokenId}` });
          break;
        case 'transfer':
          data = payload[variant] as TransferPayload;
          await batchState.transferToken({
            tokenId: `${message.source}-${data.tokenId}`,
            id: message.id,
            from: data.from,
            to: data.to,
            timestamp,
          });
          break;
        case 'nftContractAdded':
          batchState.newNftContract(payload[variant]);
          await indexNft(payload[variant], config.squid.startBlock, block.header.height, batchState, nftMeta);
          break;
        case 'marketDataAdded':
          data = payload[variant] as MarketDataAddedPayload;
          await batchState.listToken({ tokenId: `${data.nftContractId}-${data.tokenId}`, price: data.price });
          break;
        case 'itemSold':
          data = payload[variant] as ItemSoldPayload;
          await batchState.itemSold({
            ...data,
            tokenId: `${data.nftContractId}-${data.tokenId}`,
            newOwner: message.destination,
            timestamp,
            id: message.id,
          });
          break;
        case 'auctionCreated':
          data = payload[variant] as AuctionCreatedPayload;
          await batchState.newAuction({
            ...data,
            tokenId: `${data.nftContractId}-${data.tokenId}`,
            timestamp,
            id: message.id,
          });
          break;
        case 'bidAdded':
          data = payload[variant] as BidAddedPayload;
          await batchState.newBid({
            ...data,
            tokenId: `${data.nftContractId}-${data.tokenId}`,
            timestamp,
            id: message.id,
          });
          break;
        case 'auctionSettled':
          data = payload[variant] as AuctionSettledPayload;
          await batchState.settleAuction({
            ...data,
            tokenId: `${data.nftContractId}-${data.tokenId}`,
            timestamp,
            id: message.id,
          });
          break;
        case 'offerAdded':
          data = payload[variant] as OfferAddedPayload;
          await batchState.addOffer({
            ...data,
            tokenId: `${data.nftContractId}-${data.tokenId}`,
            timestamp,
            id: message.id,
            account: message.destination,
          });
          break;
        case 'offerAccepted':
          data = payload[variant] as OfferAcceptedPayload;
          await batchState.acceptOffer({
            ...data,
            tokenId: `${data.nftContractId}-${data.tokenId}`,
            timestamp,
            id: message.id,
          });
          break;
        case 'offerCancelled':
          data = payload[variant] as OfferCancelledPayload;
          await batchState.cancelOffer({
            ...data,
            tokenId: `${data.nftContractId}-${data.tokenId}`,
          });
          break;
        default:
          ctx.log.warn('Unable to define enum variant');
          ctx.log.warn(payload);
          break;
      }
    }
  }

  await batchState.save();
}

export async function run() {
  processor.run(new TypeormDatabase(), async (ctx) => {
    await handleEvent(ctx);
  });
}
