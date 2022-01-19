/// <reference types="node" />
import { Metadata } from './interfaces';
export declare function getWasmMetadata(wasmBytes: Buffer, showDebug?: boolean, pages?: any, inputValue?: Uint8Array): Promise<Metadata>;
