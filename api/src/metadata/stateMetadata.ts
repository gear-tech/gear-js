import { HexString } from '@polkadot/util/types';
import { u8aToHex } from '@polkadot/util';
import v8 from 'v8';

import { CreateType } from '../create-type';

import { HumanStateMetadata } from '../types';
import importObj from '../wasm/importObj';

export async function getStateMetadata(wasmBytes: Buffer): Promise<HumanStateMetadata> {
  const wasmModule = new WebAssembly.Module(wasmBytes);

  console.log(v8.deserialize(wasmBytes));

  const memory = new WebAssembly.Memory({ initial: 17 });

  let metadata: HexString;

  const instance = new WebAssembly.Instance(
    wasmModule,
    importObj(memory, undefined, undefined, undefined, undefined, (meta: Uint8Array) => {
      metadata = u8aToHex(meta);
    }),
  );

  const { exports } = instance;
  if (!exports?.metadata) {
    throw new Error('Unable to find exports in applied wasm');
  }

  if (typeof exports.metadata !== 'function') {
    throw new Error('exports.metadata is not a function');
  }

  exports.metadata();

  return CreateType.create('StateMetadata', metadata).toHuman() as unknown as HumanStateMetadata;
}
