import { GasInfo } from '@gear-js/api';
import { AnyJson, AnyNumber } from '@polkadot/types/types';

type CalculateGas = (initPayload: AnyJson) => Promise<GasInfo>;

type Options = {
  value?: AnyNumber;
  isOtherPanicsAllowed?: boolean;
};

type InitUploadOptions = Options & { method: 'initUpload' };
type InitCreateOptions = Options & { method: 'initCreate' };
type HandleOptions = Options & { method: 'handle' };
type ReplyOptions = Options & { method: 'reply' };

export type { CalculateGas, InitUploadOptions, InitCreateOptions, HandleOptions, ReplyOptions };
