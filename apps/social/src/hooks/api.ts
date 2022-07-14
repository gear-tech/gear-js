import { useReadState, useSendMessage, useAccount } from '@gear-js/react-hooks';
import { useMemo } from 'react';
import { routerMetaWasm } from 'assets/wasm';
import { ADDRESS } from 'consts';
import { Params, Channel, Hex } from 'types';
import { useParams } from 'react-router-dom';
import { AnyJson } from '@polkadot/types/types';

type ChannelState = { Channel: Channel };
type ChannelsState = { AllChannels: Channel[] };
type SubscriptionState = { SubscribedToChannels: Hex[] };

function useChannelState<T>(payload: AnyJson) {
  return useReadState<T>(ADDRESS.ROUTER_CONTRACT, routerMetaWasm, payload);
}

function useRouterMessage() {
  return useSendMessage(ADDRESS.ROUTER_CONTRACT, routerMetaWasm);
}

function useChannel() {
  const { id } = useParams() as Params;
  const payload = useMemo(() => ({ Channel: id }), [id]);

  const { state } = useChannelState<ChannelState>(payload);

  return state?.Channel;
}

function useChannels() {
  const payload = useMemo(() => ({ AllChannels: null }), []);
  const { state } = useChannelState<ChannelsState>(payload);

  return state?.AllChannels;
}

function useSubscriptions() {
  const { account } = useAccount();
  const actorId = account?.decodedAddress;
  const payload = useMemo(() => ({ SubscribedToChannels: actorId }), [actorId]);

  const { state } = useChannelState<SubscriptionState>(payload);

  return state?.SubscribedToChannels;
}

function useSubscribreActions() {
  const sendMessage = useRouterMessage();
  const { id } = useParams() as Params;

  const subscribe = (onSuccess: () => void) => {
    const payload = { AddSubscriberToChannel: id };

    console.log(payload)

    sendMessage(payload, { onSuccess });
  };

  const unsubscribe = (onSuccess: () => void) => {
    const payload = { RemoveSubscriberFromChannel: id };

    sendMessage(payload, { onSuccess });
  };

  return { subscribe, unsubscribe };
}

export { useChannel, useChannels, useSubscriptions, useSubscribreActions };
