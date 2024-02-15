import { hexToU8a, isHex, isU8a } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';
import importObj from './importObj';

export function getGrReply(wasm: HexString | Buffer | ArrayBuffer | Uint8Array, fn: string): Promise<Uint8Array> {
  const buffer = isHex(wasm) ? hexToU8a(wasm).buffer : isU8a(wasm) ? wasm.buffer : wasm;

  const memory = new WebAssembly.Memory({ initial: 256 });

  return new Promise((resolve, reject) => {
    WebAssembly.instantiate(
      buffer,
      importObj(memory, false, undefined, undefined, undefined, (payload: number, len: number) =>
        resolve(new Uint8Array(memory.buffer.slice(payload, payload + len))),
      ),
    )
      .then(({ instance: { exports } }) => {
        if (!(fn in exports)) {
          reject(`${fn} function not found in exports`);
        } else if (typeof exports[fn] !== 'function') {
          reject(`${fn} is not a function`);
        } else {
          (exports[fn] as () => void)();
        }
      })
      .catch((error) => reject(error));
  });
}
