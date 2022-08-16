import { Hex } from '@gear-js/api';
import { useMetadata, useReadState, useSendMessage } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useEffect, useMemo, useState } from 'react';
import supplyChainOptWasm from 'assets/wasm/supply_chain.opt.wasm';
import supplyChainMetaWasm from 'assets/wasm/supply_chain.meta.wasm';
import nftMetaWasm from 'assets/wasm/nft.meta.wasm';
import { LOCAL_STORAGE } from 'consts';
import { Item, Token } from 'types';

type ItemState = { ItemInfo: Item };
type NFTProgramState = { NFTProgram: Hex };
type NFTState = { Token: { token: Token } };

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
  const { state, isStateRead } = useSupplyChainState<ItemState>(payload);

  return { item: state?.ItemInfo, isItemRead: isStateRead };
}

function useNftProgramId() {
  const payload = useMemo(() => ({ NFTProgram: null }), []);
  const { state } = useSupplyChainState<NFTProgramState>(payload);

  return state?.NFTProgram;
}

function useNft(itemId: string) {
  const nftProgramId = useNftProgramId();

  const payload = useMemo(() => (itemId ? { Token: itemId } : undefined), [itemId]);
  const { state, isStateRead } = useReadState<NFTState>(nftProgramId, nftMetaWasm, payload);

  return { nft: state?.Token.token, isNftRead: isStateRead };
}

function useSupplyChainMessage() {
  return useSendMessage(localStorage[LOCAL_STORAGE.PROGRAM], supplyChainMetaWasm);
}

export { useSupplyChainOpt, useSupplyChainMeta, useItem, useNft, useSupplyChainMessage };
