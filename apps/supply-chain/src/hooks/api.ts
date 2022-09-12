import { Hex } from '@gear-js/api';
import { useAccount, useReadState, useSendMessage } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useMemo } from 'react';
import { LOCAL_STORAGE } from 'consts';
import { Item, Items, Token } from 'types';
import { useWasm } from './context';

type ItemState = { ItemInfo: Item };
type ItemsState = { ExistingItems: Items };
type RolesState = { Roles: string[] };
type NFTProgramState = { NFTProgram: Hex };
type NFTState = { Token: { token: Token } };

function useSupplyChainState<T>(payload: AnyJson) {
  const { supplyChain } = useWasm();
  const { metaBuffer } = supplyChain;

  return useReadState<T>(localStorage[LOCAL_STORAGE.PROGRAM], metaBuffer, payload);
}

function useItem(itemId: string) {
  const payload = useMemo(() => (itemId ? JSON.stringify({ ItemInfo: itemId }) : undefined), [itemId]);
  const { state, isStateRead } = useSupplyChainState<ItemState>(payload);

  return { item: state?.ItemInfo, isItemRead: isStateRead };
}

function useItems() {
  const payload = useMemo(() => ({ ExistingItems: null }), []);
  const { state, isStateRead } = useSupplyChainState<ItemsState>(payload);

  return { items: state?.ExistingItems, isEachItemRead: isStateRead };
}

function useRoles() {
  const { account } = useAccount();
  const address = account?.decodedAddress;

  const payload = useMemo(() => (address ? { Roles: address } : undefined), [address]);
  const { state, isStateRead } = useSupplyChainState<RolesState>(payload);

  return { roles: state?.Roles, isEachRoleRead: isStateRead };
}

function useNftProgramId() {
  const payload = useMemo(() => ({ NFTProgram: null }), []);
  const { state } = useSupplyChainState<NFTProgramState>(payload);

  return state?.NFTProgram;
}

function useNft(tokenId: string) {
  const nftProgramId = useNftProgramId();
  const { nft } = useWasm();

  const payload = useMemo(() => (tokenId ? { Token: { tokenId } } : undefined), [tokenId]);
  const { state, isStateRead } = useReadState<NFTState>(nftProgramId, nft.metaBuffer, payload);

  return { nft: state?.Token.token, isNftRead: isStateRead };
}

function useSupplyChainMessage() {
  const { supplyChain } = useWasm();
  const { meta } = supplyChain;

  return useSendMessage(localStorage[LOCAL_STORAGE.PROGRAM], meta);
}

export { useItem, useItems, useRoles, useNft, useSupplyChainMessage };
