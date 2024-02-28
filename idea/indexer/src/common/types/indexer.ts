import { GearApi } from '@gear-js/api';
import { FrameSystemEventRecord } from '@polkadot/types/lookup';
import { Vec } from '@polkadot/types';

import { TempState } from '../../gear/temp-state';
import { ExtrinsicStatus, SignedBlock } from '@polkadot/types/interfaces';

export interface HandlerParams {
  api: GearApi;
  block: SignedBlock;
  events: Vec<FrameSystemEventRecord>;
  tempState: TempState;
  timestamp: Date;
  status: ExtrinsicStatus;
  blockHash: string;
  genesis: string;
}
