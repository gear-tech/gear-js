import { config } from './config.js';
import type { IHandleEventProps } from './event.route.js';

export async function handleDnsEvent({ event, common, batchState }: IHandleEventProps): Promise<void> {
  if (event.args.message.source !== config.dns.programAddress) return;
  if (event.args.message.payload === '0x') return;
  if (event.args.message.details && event.args.message.details.code.__kind !== 'Success') return;

  await batchState.dns.handleEvent(event.args.message.payload, {
    blockNumber: common.blockNumber,
    txHash: event.args.message.id,
    timestamp: common.timestamp,
  });
}
