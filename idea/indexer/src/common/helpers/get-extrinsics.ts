import { GearCoreIdsMessageId, GearCoreIdsProgramId } from '@gear-js/api';
import { Bytes, Enum, GenericCall, GenericExtrinsic, Struct, Tuple, Vec, bool, u128, u64 } from '@polkadot/types';
import { AnyTuple, ITuple } from '@polkadot/types/types';

export const getExtrinsics = (extrinsics: Vec<GenericExtrinsic<AnyTuple>>, methods: string[]) =>
  extrinsics.filter(({ method: { method } }) => methods.includes(method));

const BATCH_CALL_METHODS = ['sendMessage', 'sendReply', 'uploadProgram', 'createProgram', 'uploadCode'];

export const getBatchExtrinsics = (extrinsics: Vec<GenericExtrinsic<Vec<Vec<GenericCall>>>>) =>
  extrinsics.filter(({ method: { method }, args }) => {
    if (!method.toLowerCase().startsWith('batch') && method.toLowerCase() !== 'forcebatch') {
      return false;
    }

    const calls = args.filter((arg: Vec<GenericCall>) => {
      return arg.filter((call) => BATCH_CALL_METHODS.includes(call.method)).length > 0;
    });

    if (calls.length === 0) {
      return false;
    }

    return true;
  });

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
