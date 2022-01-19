import { UnsubscribePromise } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { DebugDataSnapshotEvent, GearApi } from '.';
export declare class DebugMode {
    api: GearApi;
    enabled: any;
    constructor(gearApi: GearApi);
    enable(): void;
    disable(): void;
    signAndSend(keyring: KeyringPair): Promise<{
        method: string;
        data: boolean;
    }>;
    snapshots(callback: (event: DebugDataSnapshotEvent) => void | Promise<void>): UnsubscribePromise;
}
