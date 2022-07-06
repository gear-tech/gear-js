import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import { useMemo } from 'react';
import escrowMetaWasm from 'assets/wasm/escrow.meta.wasm';
import { ADDRESS } from 'consts';
import { EscrowState } from 'types';

function useEscrow(id: string) {
  const payload = useMemo(() => (id ? { Info: id } : undefined), [id]);
  const { state, isStateRead } = useReadState<EscrowState>(ADDRESS.ESCROW_CONTRACT, escrowMetaWasm, payload);

  return { escrow: state?.Info, isEscrowRead: id ? isStateRead : true };
}

function useEscrowMessage() {
  return useSendMessage(ADDRESS.ESCROW_CONTRACT, escrowMetaWasm);
}

export { useEscrow, useEscrowMessage };
