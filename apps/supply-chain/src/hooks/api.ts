import { useEffect, useState } from 'react';
import supplyChainOptWasm from 'assets/wasm/supply_chain.opt.wasm';
import supplyChainMetaWasm from 'assets/wasm/supply_chain.meta.wasm';
import { useMetadata } from '@gear-js/react-hooks';

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

export { useSupplyChainOpt, useSupplyChainMeta };
