import { archiveReq } from './archiveReq';
import config from './config';
import { Meta } from './meta';
import { BatchState } from './state';
import { MintedPayload, TransferPayload } from './types';

const LIMIT = 200;

export async function indexNft(
  programId: string,
  fromBlock: number,
  toBlock: number,
  batchState: BatchState,
  nftMeta: Meta,
) {
  /* eslint-disable max-len*/
  const query = `query {
    batch(fromBlock: ${fromBlock}, toBlock: ${toBlock}, limit: ${LIMIT}, includeAllBlocks: false, gearUserMessagesSent: [{program: "${programId}", data: {event: {args: true}}}]){
      header {
        height
        hash
        timestamp
      }
      events
    }
  }`;

  const {
    data: { batch },
  } = await archiveReq(config.squid.archiveUrl, query);

  if (batch.length === 0) return;

  for (const { header, events } of batch) {
    for (const {
      args: { message },
      name,
    } of events) {
      if (name !== 'Gear.UserMessageSent') continue;
      const payload = nftMeta.decodeOut(message.payload);
      const variant = Object.keys(payload)[0];
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
          data = payload[variant];
          await batchState.burnToken({ tokenId: `${message.source}-${data.tokenId}` });
          break;
        case 'transfer':
          data = payload[variant] as TransferPayload;
          await batchState.transferToken({
            tokenId: `${message.source}-${data.tokenId}`,
            id: message.id,
            from: data.from,
            to: data.to,
            timestamp: Date.parse(header.timestamp),
          });
          break;
      }
    }

    if (batch.length === LIMIT) {
      const lastBlock = 0;
      batch.forEach(({ header: { height } }) => Math.max(lastBlock, height));
      await indexNft(programId, lastBlock, toBlock, batchState, nftMeta);
    }
  }
}
