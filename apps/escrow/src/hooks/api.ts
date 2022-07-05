import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import { useMemo } from 'react';
import escrowMetaWasm from 'assets/wasm/escrow.meta.wasm';
import { ADDRESS } from 'consts';

function useEscrow(id: string) {
  const payload = useMemo(() => ({ Info: id }), [id]);
  const { state } = useReadState(ADDRESS.ESCROW_CONTRACT, escrowMetaWasm, payload);

  return state;
}

function useEscrowMessage() {
  return useSendMessage(ADDRESS.ESCROW_CONTRACT, escrowMetaWasm);
}

export { useEscrow, useEscrowMessage };
