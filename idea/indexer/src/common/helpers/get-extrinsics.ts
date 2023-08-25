import { SignedBlockExtended } from '@polkadot/api-derive/types';

export const getExtrinsics = ({ block: { extrinsics } }: SignedBlockExtended, methods: string[]) =>
  extrinsics.filter(({ method: { method } }) => methods.includes(method));

export const getBatchExtrinsics = ({ block: { extrinsics } }: SignedBlockExtended) =>
  extrinsics.filter(({ method: { method } }) => method.toLowerCase().startsWith('batch'));
