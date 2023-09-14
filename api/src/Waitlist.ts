import { GearCommonStoragePrimitivesInterval, GearCoreMessageStoredStoredDispatch } from '@polkadot/types/lookup';
import { HexString } from '@polkadot/util/types';
import { Option } from '@polkadot/types';

import { GearApi } from './GearApi';
import { ITuple } from '@polkadot/types-codec/types';

export class GearWaitlist {
  constructor(private _api: GearApi) {}

  /**
   * ## _Read program's waitlist_
   * @param programId
   * @param numberOfMessages _(default 1000)_ number of messages that will be read from program's waitlist
   * @example
   * ```javascript
   * const api = await GearApi.create();
   * const waitlist = await api.waitlist.read('0xe0c6997d0bd83269ec108474494e2bd6ed156b30de599b9f2c91e82bb6ad04e8');
   * console.log(waitlist.map(item => item.toHuman()));
   * ```
   */
  async read(
    programId: HexString,
    numberOfMessages?: number,
  ): Promise<ITuple<[GearCoreMessageStoredStoredDispatch, GearCommonStoragePrimitivesInterval]>[]>;

  /**
   * ## _Get particular message from program's waitlist_
   * @param programId
   * @param messageId
   * @example
   * ```javascript
   * const api = await GearApi.create();
   * const programId = '0xe0c6997d0bd83269ec108474494e2bd6ed156b30de599b9f2c91e82bb6ad04e8'
   * const messageId = '0xe9f3b99f23203d0c032868d3bd0349c8e243119626a8af98a2f4ac5ea6c78947'
   * const waitlist = await api.waitlist.read(programId, messageId);
   * console.log(waitlist.toHuman());
   * ```
   */
  async read(
    programId: HexString,
    messageId: HexString,
  ): Promise<ITuple<[GearCoreMessageStoredStoredDispatch, GearCommonStoragePrimitivesInterval]>>;

  async read(
    programId: HexString,
    messageIdOrNumberOfMessages?: HexString | number,
  ): Promise<
    | ITuple<[GearCoreMessageStoredStoredDispatch, GearCommonStoragePrimitivesInterval]>[]
    | ITuple<[GearCoreMessageStoredStoredDispatch, GearCommonStoragePrimitivesInterval]>
  > {
    const [messageId, numberOfMessages] =
      typeof messageIdOrNumberOfMessages === 'string'
        ? [messageIdOrNumberOfMessages, undefined]
        : [undefined, messageIdOrNumberOfMessages || 1000];

    if (messageId) {
      const waitlist = await this._api.query.gearMessenger.waitlist(programId, messageId);
      const typedWaitlist = this._api.createType<
        Option<ITuple<[GearCoreMessageStoredStoredDispatch, GearCommonStoragePrimitivesInterval]>>
      >('Option<(GearCoreMessageStoredStoredDispatch, GearCommonStoragePrimitivesInterval)>', waitlist);
      return typedWaitlist.unwrapOr(null);
    } else {
      const keyPrefix = this._api.query.gearMessenger.waitlist.keyPrefix(programId);
      const keysPaged = await this._api.rpc.state.getKeysPaged(keyPrefix, numberOfMessages, keyPrefix);
      if (keysPaged.length === 0) {
        return [];
      }
      const waitlist = (await this._api.rpc.state.queryStorageAt(keysPaged)) as Option<
        ITuple<[GearCoreMessageStoredStoredDispatch, GearCommonStoragePrimitivesInterval]>
      >[];
      return waitlist.map((item) => {
        const typedItem = this._api.createType<
          Option<ITuple<[GearCoreMessageStoredStoredDispatch, GearCommonStoragePrimitivesInterval]>>
        >('Option<(GearCoreMessageStoredStoredDispatch, GearCommonStoragePrimitivesInterval)>', item);
        return typedItem.unwrapOr(null);
      });
    }
  }
}
