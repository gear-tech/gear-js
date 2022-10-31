import { useContext } from 'react';
import { WasmContext } from 'context';

const useWasm = () => useContext(WasmContext);

export { useWasm };
