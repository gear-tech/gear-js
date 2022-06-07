import { GenericEventData, GenericEvent } from '@polkadot/types';
import { Event } from '@polkadot/types/interfaces';
import {
  CodeChangedData,
  DebugData,
  MessageEnqueuedData,
  MessagesDispatchedData,
  MessageWaitedData,
  MessageWokenData,
  ProgramChangedData,
  TransferData,
  UserMessageReadData,
  UserMessageSentData,
  DebugModeData,
} from './GearEventData';
import { IGearEvent } from './types';

export class GearGenericEvent extends GenericEvent {
  constructor(event: Event) {
    super(event.registry, event.toU8a());
  }
}

export class MessageEnqueued extends GearGenericEvent {
  public get data(): MessageEnqueuedData {
    return new MessageEnqueuedData(this.getT('data'));
  }
}

export class UserMessageSent extends GearGenericEvent {
  public get data(): UserMessageSentData {
    return new UserMessageSentData(this.getT('data'));
  }
}

export class UserMessageRead extends GearGenericEvent {
  public get data(): UserMessageReadData {
    return new UserMessageReadData(this.getT('data'));
  }
}

export class MessagesDispatched extends GearGenericEvent {
  public get data(): MessagesDispatchedData {
    return new MessagesDispatchedData(this.getT('data'));
  }
}

export class MessageWaited extends GearGenericEvent {
  public get data(): MessageWaitedData {
    return new MessageWaitedData(this.getT('data'));
  }
}

export class MessageWaken extends GearGenericEvent {
  public get data(): MessageWokenData {
    return new MessageWokenData(this.getT('data'));
  }
}

export class CodeChanged extends GearGenericEvent {
  public get data(): CodeChangedData {
    return new CodeChangedData(this.getT('data'));
  }
}

export class ProgramChanged extends GearGenericEvent {
  public get data(): ProgramChangedData {
    return new ProgramChangedData(this.getT('data'));
  }
}

export class DebugDataSnapshot extends GearGenericEvent {
  public get data(): DebugData {
    return new DebugData(this.getT('data'));
  }
}

export class DebugMode extends GearGenericEvent {
  public get data(): DebugModeData {
    return new DebugModeData(this.getT('data'));
  }
}

export class Transfer extends GenericEvent {
  constructor(event: Event) {
    super(event.registry, event.toU8a());
  }

  public get data(): TransferData {
    return new TransferData(this.get('data') as GenericEventData);
  }
}

const events = {
  MessageEnqueued: MessageEnqueued,
  UserMessageSent: UserMessageSent,
  UserMessageRead: UserMessageRead,
  MessagesDispatched: MessagesDispatched,
  MessageWaited: MessageWaited,
  MessageWaken: MessageWaken,
  CodeChanged: CodeChanged,
  ProgramChanged: ProgramChanged,
  DebugDataSnapshot: DebugDataSnapshot,
  DebugMode: DebugMode,
};

export function createEventClass<M extends keyof IGearEvent = keyof IGearEvent>(
  method: M,
  event: Event,
): IGearEvent[M] {
  const class_ = new events[method](event) as IGearEvent[M];
  return class_;
}
