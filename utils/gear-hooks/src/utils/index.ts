import { GasInfo, GearApi } from '@gear-js/api';
import { Keyring } from '@polkadot/api';
import { Event } from '@polkadot/types/interfaces';
import { BigNumber } from 'bignumber.js';

import { VARA_SS58_FORMAT } from 'consts';

import { Entries } from '../types';

const getAutoGasLimit = ({ waited, min_limit }: GasInfo, _multiplier?: number) => {
  const limit = new BigNumber(min_limit.toString());
  const multiplier = _multiplier || (waited ? 1.1 : 1);

  return limit.multipliedBy(multiplier).toFixed(0);
};

const withoutCommas = (value: string) => value.replace(/,/g, '');

const getExtrinsicFailedMessage = (api: GearApi, event: Event) => {
  const { docs, method } = api.getExtrinsicFailedError(event);

  return `${method}: ${docs}`;
};

const getVaraAddress = (address: string) => new Keyring().encodeAddress(address, VARA_SS58_FORMAT);

const getTypedEntries = <T extends object>(value: T) => Object.entries(value) as Entries<T>;

export { getAutoGasLimit, withoutCommas, getExtrinsicFailedMessage, getVaraAddress, getTypedEntries };
