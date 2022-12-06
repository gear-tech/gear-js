import { HexString } from '@polkadot/util/types';
import { u8aToHex } from '@polkadot/util';

import { CreateType } from '../create-type/CreateType';
import { HumanStateMetadata } from '../types';
import importObj from '../wasm/importObj';

export async function getStateMetadata(wasmBytes: Buffer): Promise<HumanStateMetadata> {
  const memory = new WebAssembly.Memory({ initial: 17 });

  let metadata: HexString;

  const { instance } = await WebAssembly.instantiate(
    wasmBytes,
    importObj(memory, undefined, undefined, undefined, undefined, (meta: Uint8Array) => {
      metadata = u8aToHex(meta);
    }),
  );

  const { exports } = instance;

  if (!exports?.metadata) {
    throw new Error('Unable to find metadata function in exports of applied wasm');
  }

  if (typeof exports.metadata !== 'function') {
    throw new Error('exports.metadata is not a function');
  }

  exports.metadata();

  return CreateType.create('StateMetadata', metadata).toHuman() as unknown as HumanStateMetadata;
}
