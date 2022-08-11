import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { LOCAL_STORAGE } from 'consts';
import { StakerState, Staker } from 'types/state';

const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;

const convertToNumber = (value: string) => +value.replaceAll(',', '');

const preparedStakerState = (staker: StakerState['Staker']): Staker => {
  const preparedStaker = Object.entries(staker).map(([key, value]) => [key, convertToNumber(value)]);

  return Object.fromEntries(preparedStaker);
};

export { isLoggedIn, convertToNumber, preparedStakerState };
