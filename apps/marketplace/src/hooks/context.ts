import { useContext } from 'react';
import { IPFSContext, WasmContext } from 'context';

const useIPFS = () => useContext(IPFSContext);
const useWasm = () => useContext(WasmContext);

export { useIPFS, useWasm };
