import { HexString } from '@polkadot/util/types';
import { useLocation, useParams } from 'react-router-dom';

type Params = {
  programId: HexString;
};

const useProgramId = () => {
  const { programId } = useParams() as Params;

  return programId;
};

const useStateType = () => {
  const location = useLocation();

  const [, , type] = location.pathname.split('/');
  const isFull = type === 'full';
  const isWasm = type === 'wasm';
  const isSelection = !isFull && !isWasm;

  return { stateType: type, isFullState: isFull, isWasmState: isWasm, isStateTypeSelection: isSelection };
};

export { useProgramId, useStateType };
