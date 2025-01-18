import { HumanStateMetadataRepr, StateFunctions, StateMetadataRepr } from '../types';
import { CreateType } from './create-type';
import { GearMetadata } from './metadata';
import importObj from '../wasm/importObj';

export class StateMetadata extends GearMetadata {
  functions: StateFunctions;

  constructor({ reg, functions }: HumanStateMetadataRepr) {
    super(reg);
    this.functions = functions;
  }
}

/**
 * @deprecated - This functionality is deprecated and will be removed from both the API and the runtime. Use `api.message.calculateReply` instead.
 */
export async function getStateMetadata(wasmBytes: Uint8Array): Promise<StateMetadata> {
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

  const meta = CreateType.create<StateMetadataRepr>('StateMetadataRepr', await metadata);

  return new StateMetadata(meta.toJSON());
}
