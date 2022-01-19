import { GenericEvent } from '@polkadot/types';
import { Event } from '@polkadot/types/interfaces';
import { DebugData, DispatchMessageEnqueuedData, InitFailureData, InitMessageEnqueuedData, InitSuccessData, LogData, ProgramData, TransferData } from '.';
export declare class GearEvent extends GenericEvent {
    constructor(event: Event);
}
export declare class ProgramEvent extends GearEvent {
    get data(): ProgramData;
}
export declare class InitSuccessEvent extends GearEvent {
    get data(): InitSuccessData;
}
export declare class InitFailureEvent extends GearEvent {
    get data(): InitFailureData;
}
export declare class LogEvent extends GearEvent {
    get data(): LogData;
}
export declare class TransferEvent extends GearEvent {
    get data(): TransferData;
}
export declare class InitMessageEnqueuedEvent extends GearEvent {
    get data(): InitMessageEnqueuedData;
}
export declare class DispatchMessageEnqueuedEvent extends GearEvent {
    get data(): DispatchMessageEnqueuedData;
}
export declare class DebugDataSnapshotEvent extends GearEvent {
    get data(): DebugData;
}
