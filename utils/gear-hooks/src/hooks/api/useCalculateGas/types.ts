import { GasInfo } from '@gear-js/api';
import { AnyJson, AnyNumber } from '@polkadot/types/types';

type InitMethod = 'initUpload' | 'initCreate';
type HandleMethod = 'handle' | 'reply';
type CalculateGas = (initPayload: AnyJson) => Promise<GasInfo>;

type Options = {
  value?: AnyNumber;
  isOtherPanicsAllowed?: boolean;
};

type InitOptions = Options & { method: InitMethod };
type HandleOptions = Options & { method: HandleMethod };

export type { CalculateGas, InitOptions, HandleOptions };
