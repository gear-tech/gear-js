import { readMetaValue } from './utils';
import { OldMetadata } from '../types';
import importObj from './importObj';

export async function getWasmMetadata(wasmBytes: Buffer, showDebug = false): Promise<OldMetadata> {
  const memory = new WebAssembly.Memory({ initial: 256 });
  const module = await WebAssembly.instantiate(wasmBytes, importObj(memory, showDebug));
  const { exports } = module.instance;
  return exports
    ? {
        types: `0x${readMetaValue(memory, exports.meta_registry)}`,
        init_input: readMetaValue(memory, exports.meta_init_input),
        init_output: readMetaValue(memory, exports.meta_init_output),
        async_init_input: readMetaValue(memory, exports.meta_async_init_input),
        async_init_output: readMetaValue(memory, exports.meta_async_init_output),
        handle_input: readMetaValue(memory, exports.meta_handle_input),
        handle_output: readMetaValue(memory, exports.meta_handle_output),
        async_handle_input: readMetaValue(memory, exports.meta_async_handle_input),
        async_handle_output: readMetaValue(memory, exports.meta_async_handle_output),
        title: readMetaValue(memory, exports.meta_title),
        meta_state_input: readMetaValue(memory, exports.meta_state_input),
        meta_state_output: readMetaValue(memory, exports.meta_state_output),
      }
    : {};
}
