import { Metadata } from './interfaces';
import { H256 } from '@polkadot/types/interfaces';
import { AnyNumber } from '@polkadot/types/types';
import { GearTransaction } from './types/Transaction';
export declare class GearMessage extends GearTransaction {
    submit(message: {
        destination: string | H256;
        payload: string | any;
        gasLimit: AnyNumber;
        value?: AnyNumber;
    }, meta?: Metadata, messageType?: string): any;
}
