import { WasmContext } from 'context';
import { useContext } from 'react';

const useWasm = () => useContext(WasmContext);

export { useWasm };
