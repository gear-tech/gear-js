import { useMetadata, useReadState, useSendMessage } from '@gear-js/react-hooks';
import { useEffect, useMemo, useState } from 'react';
import escrowOptWasm from 'assets/wasm/escrow.opt.wasm';
import escrowMetaWasm from 'assets/wasm/escrow.meta.wasm';
import { EscrowState } from 'types';
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

function useEscrow(id: string) {
  const payload = useMemo(() => (id ? { Info: id } : undefined), [id]);

  const { state, isStateRead } = useReadState<EscrowState>(getProgramId(), escrowMetaWasm, payload);

  const escrow = id ? state?.Info : undefined;
  const isEscrowRead = id ? isStateRead : true;

  return { escrow, isEscrowRead };
}

function useEscrowMessage() {
  return useSendMessage(getProgramId(), escrowMetaWasm);
}

export { useEscrowMeta, useEscrowOpt, useEscrow, useEscrowMessage };
