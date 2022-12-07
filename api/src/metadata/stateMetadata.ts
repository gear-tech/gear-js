import { CreateType } from '../create-type/CreateType';
import { HumanStateMetadataRepr, HumanTypesRepr, StateMetadataRepr } from '../types';
import importObj from '../wasm/importObj';
import { GearMetadata } from './metadata';

export class StateMetadata extends GearMetadata {
  functions: Record<string, HumanTypesRepr>;

  constructor({ reg, functions }: HumanStateMetadataRepr) {
    super(reg);
    this.functions = functions;
  }
}

export async function getStateMetadata(wasmBytes: Buffer): Promise<StateMetadata> {
  const memory = new WebAssembly.Memory({ initial: 17 });

  let resolveMetadataPromise: (metadata: Uint8Array) => void;

  const metadata: Promise<Uint8Array> = new Promise((resolve) => {
    resolveMetadataPromise = resolve;
  });

  const { instance } = await WebAssembly.instantiate(
    wasmBytes,
    importObj(memory, undefined, undefined, undefined, undefined, (payload: number, len: number) => {
      resolveMetadataPromise(new Uint8Array(memory.buffer.slice(payload, payload + len)));
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

  const meta = CreateType.create<StateMetadataRepr>('StateMetadataRepr', await metadata, true);

  return new StateMetadata(meta.toJSON());
}
