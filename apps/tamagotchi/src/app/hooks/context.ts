import { useContext } from 'react';
import { WasmContext } from 'app/context';

export const useWasm = () => useContext(WasmContext);
