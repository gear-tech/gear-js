import { SubstrateBatchProcessor } from '@subsquid/substrate-processor';

import config from '../config/configuration';
import { SubSquidMessageEventType } from '../common/enum';

const { subsquid } = config();

export const processor = new SubstrateBatchProcessor()
  .setDataSource({ archive: subsquid.archiveProvider })
  .addEvent(SubSquidMessageEventType.GEAR_MESS_ENQUEUED, { data: { event: { args: true, extrinsic: true } } })
  .addEvent(SubSquidMessageEventType.GEAR_USER_MESS_SENT, { data: { event: { args: true } } })
  .addEvent(SubSquidMessageEventType.GEAR_USER_MESS_READ, { data: { event: { args: true } } })
  .addEvent(SubSquidMessageEventType.GEAR_MESS_DISPATCHED, { data: { event: { args: true } } })
  .addEvent(SubSquidMessageEventType.GEAR_MESS_WAITED, { data: { event: { args: true } } })
  .addEvent(SubSquidMessageEventType.GEAR_MESS_WOKEN, { data: { event: { args: true } } })
  .includeAllBlocks();
