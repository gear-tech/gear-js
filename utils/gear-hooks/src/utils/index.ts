import { GasInfo, GearApi } from '@gear-js/api';
import { Keyring } from '@polkadot/api';
import { Event } from '@polkadot/types/interfaces';
import { bnToBn } from '@polkadot/util';

import { Entries } from 'types';
import { VARA_SS58_FORMAT } from 'consts';

const getAutoGasLimit = ({ waited, min_limit }: GasInfo) =>
  waited ? min_limit.add(min_limit.mul(bnToBn(0.1))) : min_limit;

const withoutCommas = (value: string) => value.replace(/,/g, '');

const getExtrinsicFailedMessage = (api: GearApi, event: Event) => {
  const { docs, method } = api.getExtrinsicFailedError(event);

  return `${method}: ${docs}`;
};

const getVaraAddress = (address: string) => new Keyring().encodeAddress(address, VARA_SS58_FORMAT);

const getTypedEntries = <T extends object>(value: T) => Object.entries(value) as Entries<T>;

export { getAutoGasLimit, withoutCommas, getExtrinsicFailedMessage, getVaraAddress, getTypedEntries };
