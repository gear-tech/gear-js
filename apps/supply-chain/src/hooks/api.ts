import { useEffect, useState } from 'react';
import supplyChainOptWasm from 'assets/wasm/supply_chain.opt.wasm';
import supplyChainMetaWasm from 'assets/wasm/supply_chain.meta.wasm';
import { useMetadata, useSendMessage } from '@gear-js/react-hooks';
import { LOCAL_STORAGE } from 'consts';

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

function useSupplyChainMessage() {
  return useSendMessage(localStorage[LOCAL_STORAGE.PROGRAM], supplyChainMetaWasm);
}

export { useSupplyChainOpt, useSupplyChainMeta, useSupplyChainMessage };
