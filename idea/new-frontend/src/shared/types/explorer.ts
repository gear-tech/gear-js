/* eslint-disable no-underscore-dangle */
import { Compact, Vec, GenericEvent } from '@polkadot/types';
import { FrameSystemEventRecord } from '@polkadot/types/lookup';
import { BlockNumber, Event as DotEvent } from '@polkadot/types/interfaces';

import { generateRandomId } from 'shared/helpers';

export class IdeaEvent extends GenericEvent {
  constructor(event: DotEvent, blockNumber?: Compact<BlockNumber>) {
    const { section, method, meta, hash } = event;
    const { docs } = meta;

    super(event.registry, event.toU8a());

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

export enum Method {
  Transfer = 'Transfer',
  CodeSaved = 'CodeSaved',
  ProgramChanged = 'ProgramChanged',
  UserMessageSent = 'UserMessageSent',
  UserMessageRead = 'UserMessageRead',
  MessageEnqueued = 'MessageEnqueued',
  MessagesDispatched = 'MessagesDispatched',
  ExtrinsicFailed = 'ExtrinsicFailed',
  ExtrinsicSuccess = 'ExtrinsicSuccess',
}

export type EventRecords = Vec<FrameSystemEventRecord>;
