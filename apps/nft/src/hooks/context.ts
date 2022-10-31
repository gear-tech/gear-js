import { IPFSContext, WasmContext } from 'context';
import { useContext } from 'react';

const useIPFS = () => useContext(IPFSContext);
const useWasm = () => useContext(WasmContext);

export { useIPFS, useWasm };
