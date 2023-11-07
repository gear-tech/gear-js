import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

export type ICallOptions =
  | { SendMessage: SubmittableExtrinsic<'promise', ISubmittableResult> }
  | { SendReply: SubmittableExtrinsic<'promise', ISubmittableResult> };
