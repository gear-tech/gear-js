import { useMetadata, useReadState, useSendMessage } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useEffect, useMemo, useState } from 'react';
import escrowOptWasm from 'assets/wasm/escrow.opt.wasm';
import escrowMetaWasm from 'assets/wasm/escrow.meta.wasm';
import { EscrowState, WalletsState } from 'types';
import { getProgramId } from 'utils';

function useEscrowOpt() {
  const [uintArray, setUintArray] = useState<Uint8Array>();
  const [buffer, setBuffer] = useState<Buffer>();

  useEffect(() => {
    fetch(escrowOptWasm)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        setUintArray(new Uint8Array(arrayBuffer));
        setBuffer(Buffer.from(arrayBuffer));
      });
  }, []);

  return { uintArray, buffer };
}

function useEscrowMeta() {
  return useMetadata(escrowMetaWasm);
}

function useEscrowState<T>(payload: AnyJson, isReadOnError?: boolean) {
  return useReadState<T>(getProgramId(), escrowMetaWasm, payload, isReadOnError);
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
  return useSendMessage(getProgramId(), escrowMetaWasm);
}

export { useEscrowMeta, useEscrowOpt, useEscrow, useWallets, useEscrowMessage };
