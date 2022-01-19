/// <reference types="node" />
import { Metadata, ProgramId } from './interfaces';
import { AnyNumber } from '@polkadot/types/types';
import { Bytes, U64, u64 } from '@polkadot/types';
import { H256, BalanceOf } from '@polkadot/types/interfaces';
import { GearTransaction } from './types/Transaction';
export declare class GearProgram extends GearTransaction {
    /**
     * @param program Uploading program data
     * @param meta Metadata
     * @returns ProgramId
     */
    submit(program: {
        code: Buffer;
        salt?: string;
        initPayload?: string | any;
        gasLimit: u64 | AnyNumber;
        value?: BalanceOf | AnyNumber;
    }, meta?: Metadata, messageType?: string): ProgramId;
    allUploadedPrograms(): Promise<string[]>;
    getGasSpent(programId: string, payload: any, type: any, meta?: Metadata): Promise<U64>;
    generateProgramId(code: Bytes, salt: string): H256;
}
