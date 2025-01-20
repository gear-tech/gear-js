import { WASM_FILE_TYPE } from '../consts';

type WasmFileType = typeof WASM_FILE_TYPE[keyof typeof WASM_FILE_TYPE];

export type { WasmFileType };
