import { SignedBlockExtended } from '@polkadot/api-derive/types';

export const getExtrinsics = (block: SignedBlockExtended, methods: string[]) =>
  block.block.extrinsics.filter(({ method: { method } }) => methods.includes(method));
