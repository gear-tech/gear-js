import { useEffect, useMemo, useState } from 'react';
import supplyChainOptWasm from 'assets/wasm/supply_chain.opt.wasm';
import supplyChainMetaWasm from 'assets/wasm/supply_chain.meta.wasm';
import { useMetadata, useReadState, useSendMessage } from '@gear-js/react-hooks';
import { LOCAL_STORAGE } from 'consts';
import { AnyJson } from '@polkadot/types/types';

type ItemPayload = {};

function useSupplyChainOpt() {
  const [uintArray, setUintArray] = useState<Uint8Array>();
  const [buffer, setBuffer] = useState<Buffer>();

  useEffect(() => {
    fetch(supplyChainOptWasm)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        setUintArray(new Uint8Array(arrayBuffer));
        setBuffer(Buffer.from(arrayBuffer));
      });
  }, []);

  return { uintArray, buffer };
}

function useSupplyChainMeta() {
  return useMetadata(supplyChainMetaWasm);
}

function useSupplyChainState<T>(payload: AnyJson) {
  return useReadState<T>(localStorage[LOCAL_STORAGE.PROGRAM], supplyChainMetaWasm, payload);
}

function useItem(itemId: string) {
  const payload = useMemo(() => (itemId ? { ItemInfo: itemId } : undefined), [itemId]);
  const { state, isStateRead } = useSupplyChainState<ItemPayload>(payload);

  return { item: state, isItemRead: isStateRead };
}

function useSupplyChainMessage() {
  return useSendMessage(localStorage[LOCAL_STORAGE.PROGRAM], supplyChainMetaWasm);
}

export { useSupplyChainOpt, useSupplyChainMeta, useItem, useSupplyChainMessage };
