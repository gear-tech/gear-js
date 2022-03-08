import { GearEvent } from '@gear-js/api';
import { Compact, Vec } from '@polkadot/types';
import { BlockNumber, Event as DotEvent } from '@polkadot/types/interfaces';
import { FrameSystemEventRecord } from '@polkadot/types/lookup';
import { generateRandomId } from 'helpers';

export class IdeaEvent extends GearEvent {
  constructor(event: DotEvent, blockNumber?: Compact<BlockNumber>) {
    const { section, method, meta, hash } = event;
    const { docs } = meta;

    super(event);
    this._id = `${hash}-${generateRandomId()}`;
    this._caption = `${section}.${method}`;
    this._description = String(docs.toHuman());
    this._blockNumber = blockNumber ? String(blockNumber.toHuman()) : undefined;
  }

  private _id: string;

  private _caption: string;

  private _description: string;

  private _blockNumber: string | undefined;

  get id() {
    return this._id;
  }

  get caption() {
    return this._caption;
  }

  get description() {
    return this._description;
  }

  get blockNumber() {
    return this._blockNumber;
  }
}

export type IdeaEvents = IdeaEvent[];

export type IdeaEventsProps = {
  events: IdeaEvents;
};

export type GroupedEvents = IdeaEvents[];

export type FilterValues = { [filter: string]: boolean };

export enum Sections {
  SYSTEM = 'system',
}

export enum Methods {
  TRANSFER = 'Transfer',
  LOG = 'Log',
  INIT_SUCCESS = 'InitSuccess',
  INIT_FAILURE = 'InitFailure',
  DISPATCH_MESSAGE_ENQUEUED = 'DispatchMessageEnqueued',
  MESSAGE_DISPATCHED = 'MessageDispatched',
  EXTRINSIC_FAILED = 'ExtrinsicFailed',
  EXTRINSIC_SUCCESS = 'ExtrinsicSuccess',
}

export type EventRecords = Vec<FrameSystemEventRecord>;
