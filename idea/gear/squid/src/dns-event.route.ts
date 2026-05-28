import { config } from './config.js';
import type { IHandleEventProps } from './event.route.js';

const IS_DNS_ENABLED = config.dns.programAddress !== '';

export async function handleDnsEvent({ event, common, batchState }: IHandleEventProps): Promise<void> {
  if (!IS_DNS_ENABLED) return;
  if (event.args.message.source.toLowerCase() !== config.dns.programAddress) return;
  if (event.args.message.payload === '0x') return;
  if (event.args.message.details && event.args.message.details.code.__kind !== 'Success') return;

  await batchState.dns.handleEvent(event.args.message.payload, {
    blockNumber: common.blockNumber,
    txHash: event.args.message.id,
    timestamp: common.timestamp,
  });
}
