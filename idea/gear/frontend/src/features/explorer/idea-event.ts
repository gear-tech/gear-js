import { Compact, GenericEvent } from '@polkadot/types';
import { BlockNumber, Event as DotEvent } from '@polkadot/types/interfaces';

import { generateRandomId } from '@/shared/helpers';

class IdeaEvent extends GenericEvent {
  constructor(event: DotEvent, blockNumber?: Compact<BlockNumber>) {
    const { section, method, meta, hash } = event;
    const { docs } = meta;

    super(event.registry, event.toU8a());

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- TODO(#1800): resolve eslint comments
    this._id = `${hash}-${generateRandomId()}`;
    this._heading = `${section}.${method}`;
    // eslint-disable-next-line @typescript-eslint/no-base-to-string -- TODO(#1800): resolve eslint comments
    this._description = String(docs.toHuman());
    // eslint-disable-next-line @typescript-eslint/no-base-to-string -- TODO(#1800): resolve eslint comments
    this._blockNumber = blockNumber ? String(blockNumber.toHuman()) : undefined;
  }

  private _id: string;

  private _heading: string;

  private _description: string;

  private _blockNumber: string | undefined;

  get id() {
    return this._id;
  }

  get heading() {
    return this._heading;
  }

  get description() {
    return this._description;
  }

  get blockNumber() {
    return this._blockNumber;
  }
}

export { IdeaEvent };
