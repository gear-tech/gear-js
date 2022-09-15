import { useCreateHandler } from '@gear-js/react-hooks';
import { InitPayload } from 'types';
import { Hex } from '@gear-js/api';
import { useWasm } from './context';

function useCreateSupplyChain(onSuccess: (programId: Hex) => void) {
  const { supplyChain } = useWasm();
  const { codeHash, meta } = supplyChain;

  const createProgram = useCreateHandler(codeHash, meta);

  return (payload: InitPayload) => createProgram(payload, { onSuccess });
}

export { useCreateSupplyChain };
