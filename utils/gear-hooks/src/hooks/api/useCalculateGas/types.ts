import { GasInfo } from '@gear-js/api';
import { AnyJson, AnyNumber } from '@polkadot/types/types';

type CalculateGas = (initPayload: AnyJson) => Promise<GasInfo>;

type Options = {
  isOtherPanicsAllowed?: boolean;
};

export type { CalculateGas, Options };
