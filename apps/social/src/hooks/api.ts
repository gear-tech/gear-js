import { useReadState } from '@gear-js/react-hooks';
import { useMemo } from 'react';
import { routerMetaWasm } from 'assets/wasm';
import { ADDRESS } from 'consts';
import { Params, Channel } from 'types';
import { useParams } from 'react-router-dom';
import { AnyJson } from '@polkadot/types/types';

type ChannelState = { Channel: { channel: Channel } };
type ChannelsState = { AllChannels: Channel[] };

function useChannelState<T>(payload: AnyJson) {
  return useReadState<T>(ADDRESS.ROUTER_CONTRACT, routerMetaWasm, payload);
}

function useChannel() {
  const { id } = useParams() as Params;
  const payload = useMemo(() => ({ Token: { tokenId: id } }), [id]);

  const { state } = useChannelState<ChannelState>(payload);

  return state?.Channel.channel;
}

function useChannels() {
  const payload = useMemo(() => ({ AllChannels: null }), []);
  const { state } = useChannelState<ChannelsState>(payload);

  return state?.AllChannels;
}

export { useChannel, useChannels };
