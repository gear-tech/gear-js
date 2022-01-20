import type { AugmentedSubmittable, SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { Bytes, u64 } from '@polkadot/types';
import type { BalanceOf, H256 } from '@polkadot/types/interfaces/runtime';
import { AnyNumber } from '@polkadot/types/types';
declare module '@polkadot/api/types/submittable' {
  interface AugmentedSubmittables<ApiType> {
    gear: {
      processQueue: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      sendMessage: AugmentedSubmittable<
        (
          destination: H256 | string | Uint8Array,
          payload: Bytes | string | Uint8Array,
          gasLimit: u64 | AnyNumber | Uint8Array,
          value: BalanceOf | AnyNumber | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [H256, Bytes, u64, BalanceOf]
      >;
      submitProgram: AugmentedSubmittable<
        (
          code: Bytes | string | Uint8Array,
          salt: Bytes | string | Uint8Array,
          initPayload: Bytes | string | Uint8Array,
          gasLimit: u64 | AnyNumber | Uint8Array,
          value: BalanceOf | AnyNumber | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [Bytes, Bytes, Bytes, u64, BalanceOf]
      >;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
  }
}
