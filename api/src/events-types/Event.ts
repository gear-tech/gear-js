import { GenericEvent } from '@polkadot/types';
import { Event } from '@polkadot/types/interfaces';
import {
  DebugData,
  DispatchMessageEnqueuedData,
  InitFailureData,
  InitMessageEnqueuedData,
  InitSuccessData,
  LogData,
  ProgramData,
  TransferData,
  MessageDispatchedData,
} from './EventData';

export class GearEvent extends GenericEvent {
  constructor(event: Event) {
    super(event.registry, event.toU8a());
  }
}

export class ProgramEvent extends GearEvent {
  public get data() {
    return new ProgramData(this.get('data') as ProgramData);
  }
}
export class InitSuccessEvent extends GearEvent {
  public get data() {
    return new InitSuccessData(this.get('data') as InitSuccessData);
  }
}

export class InitFailureEvent extends GearEvent {
  public get data() {
    return new InitFailureData(this.get('data') as InitFailureData);
  }
}

export class LogEvent extends GearEvent {
  public get data(): LogData {
    return new LogData(this.get('data') as LogData);
  }
}

export class TransferEvent extends GearEvent {
  public get data(): TransferData {
    return new TransferData(this.get('data') as TransferData);
  }
}

export class InitMessageEnqueuedEvent extends GearEvent {
  public get data() {
    return new InitMessageEnqueuedData(this.get('data') as InitMessageEnqueuedData);
  }
}

export class DispatchMessageEnqueuedEvent extends GearEvent {
  public get data() {
    return new DispatchMessageEnqueuedData(this.get('data') as DispatchMessageEnqueuedData);
  }
}

export class DebugDataSnapshotEvent extends GearEvent {
  public get data() {
    return new DebugData(this.get('data') as DebugData);
  }
}

export class MessageDispatchedEvent extends GearEvent {
  public get data() {
    return new MessageDispatchedData(this.get('data') as MessageDispatchedData);
  }
}
