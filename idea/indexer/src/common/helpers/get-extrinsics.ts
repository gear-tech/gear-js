import { GearCoreIdsMessageId, GearCoreIdsProgramId } from '@gear-js/api';
import { Bytes, Enum, GenericCall, GenericExtrinsic, Struct, Vec, bool, u128, u64 } from '@polkadot/types';
import { AnyTuple, ITuple } from '@polkadot/types/types';

export const getExtrinsics = (extrinsics: Vec<GenericExtrinsic<AnyTuple>>, methods: string[]) =>
  extrinsics.filter(({ method: { method } }) => methods.includes(method));

interface BatchArgs extends Struct {
  calls: Vec<GenericCall>;
}

export const getBatchExtrinsics = (extrinsics: Vec<GenericExtrinsic<AnyTuple>>) =>
  extrinsics.filter(
    ({ method: { method }, args }) =>
      (method.toLowerCase().startsWith('batch') || method.toLowerCase() === 'forcebatch') &&
      args.filter(({ calls }: BatchArgs) => {
        if (!calls) {
          return false;
        }
        !!calls.find(({ method }) =>
          ['sendMessage', 'sendReply', 'uploadProgram', 'createProgram', 'uploadCode'].includes(method),
        );
      }).length > 0,
  );

interface VoucherCall extends Enum {
  isSendMessage: boolean;
  asSendMessage: {
    destination: GearCoreIdsProgramId;
    payload: Bytes;
    gasLimit: u64;
    value: u128;
    keepAlive: bool;
  };
  isSendReply: boolean;
  asSendReply: {
    replyToId: GearCoreIdsMessageId;
    payload: Bytes;
    gasLimit: u64;
    value: u128;
    keepAlive: bool;
  };
  isUploadCode: boolean;
  asUploadCode: {
    code: Bytes;
  };
}

interface VoucherArgs extends Struct {
  call: VoucherCall;
}

export const getVoucherExtrinsics = (extrinsics: Vec<GenericExtrinsic<AnyTuple>>) =>
  extrinsics.filter(
    ({ method: { method, section } }) => section === 'gearVoucher' && method === 'call',
  ) as GenericExtrinsic<ITuple<[VoucherArgs]>>[];

export const getGearRunExtrinsic = (extrinsics: Vec<GenericExtrinsic<AnyTuple>>) =>
  extrinsics.find(({ method: { section, method } }) => section === 'gear' && method === 'run');
