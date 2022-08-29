import { Store } from '@subsquid/typeorm-store';
import { archiveReq } from './archiveReq';
import config from './config';
import { handleNftEvent } from './handlers';

const LIMIT = 200;

export async function indexNft(programId: string, fromBlock: number, toBlock: number, store: Store) {
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

  let {
    data: { batch },
  } = await archiveReq(config.squid.archiveUrl, query);

  console.log(JSON.stringify(batch, undefined, 4));

  if (batch.length === 0) return;

  for (const { header, events } of batch) {
    for (const { args, name, id } of events) {
      if (name !== 'Gear.UserMessageSent') continue;
      await handleNftEvent(args.message, store, id, Date.parse(header.timestamp));
    }
  }

  if (batch.length === LIMIT) {
    let lastBlock = 0;
    batch.forEach(({ header: { height } }) => Math.max(lastBlock, height));
    await indexNft(programId, lastBlock, toBlock, store);
  }
}
