import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useMemo } from 'react';
import { EscrowState, WalletsState } from 'types';
import { getProgramId } from 'utils';
import { useWasm } from './context';

function useEscrowState<T>(payload: AnyJson, isReadOnError?: boolean) {
  const { metaBuffer } = useWasm();

  return useReadState<T>(getProgramId(), metaBuffer, payload, isReadOnError);
}

function useEscrow(id: string) {
  const payload = useMemo(() => (id ? { Info: id } : undefined), [id]);
  const { state, isStateRead } = useEscrowState<EscrowState>(payload);

  const escrow = id ? state?.Info : undefined;
  const isEscrowRead = id ? isStateRead : true;

  return { escrow, isEscrowRead };
}

function useWallets() {
  const payload = useMemo(() => ({ CreatedWallets: null }), []);
  const { state, isStateRead } = useEscrowState<WalletsState>(payload, true);

  return { wallets: state?.CreatedWallets, isWalletsStateRead: isStateRead };
}

function useEscrowMessage() {
  const { meta } = useWasm();

  return useSendMessage(getProgramId(), meta);
}

export { useEscrow, useWallets, useEscrowMessage };
