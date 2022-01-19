import { GearApi, Message } from '.';
import { Option, BTreeMap } from '@polkadot/types';
import { AccountId32, H256 } from '@polkadot/types/interfaces';
export declare class GearMailbox {
    api: GearApi;
    constructor(gearApi: GearApi);
    readMailbox(accountId: string | AccountId32): Promise<Option<BTreeMap<H256, Message>>>;
}
