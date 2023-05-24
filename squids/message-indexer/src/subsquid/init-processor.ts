import { SubstrateBatchProcessor } from '@subsquid/substrate-processor';

import config from '../config/configuration';
import { EventType } from '../common/enum';

const { subsquid } = config;

export const processor = new SubstrateBatchProcessor()
  .setDataSource({ archive: subsquid.archiveProvider })
  .addEvent(EventType.GEAR_MSG_QUEUED, { data: { event: { args: true, extrinsic: true } } })
  .addEvent(EventType.GEAR_USER_MSG_SENT, { data: { event: { args: true } } })
  .addEvent(EventType.GEAR_USER_MSG_READ, { data: { event: { args: true } } })
  .addEvent(EventType.GEAR_MSG_DISPATCHED, { data: { event: { args: true } } })
  .addEvent(EventType.GEAR_MSG_WAITED, { data: { event: { args: true } } })
  .addEvent(EventType.GEAR_MSG_WOKEN, { data: { event: { args: true } } })
  .includeAllBlocks();
