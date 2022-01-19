import { GearApi, IBalanceCallback, IBlocksCallback, IEventCallback } from '.';
import { LogEvent, ProgramEvent, TransferEvent } from './types';
import { UnsubscribePromise } from '@polkadot/api/types';
export declare class GearEvents {
    private api;
    constructor(gearApi: GearApi);
    subscribeLogEvents(callback: IEventCallback<LogEvent>): UnsubscribePromise;
    subscribeProgramEvents(callback: IEventCallback<ProgramEvent>): UnsubscribePromise;
    subscribeTransferEvents(callback: IEventCallback<TransferEvent>): UnsubscribePromise;
    subscribeNewBlocks(callback: IBlocksCallback): UnsubscribePromise;
    subsribeBalanceChange(accountAddress: string, callback: IBalanceCallback): UnsubscribePromise;
}
