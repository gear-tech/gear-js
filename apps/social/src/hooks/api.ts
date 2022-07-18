import { useEffect, useState, useMemo } from 'react';
import { useReadState, useSendMessage, useAccount, useApi } from '@gear-js/react-hooks';
import { routerMetaWasm } from 'assets/wasm';
import { ADDRESS, GENESIS } from 'consts';
import { ServerRPCRequestService } from 'services';
import { Params, Channel, Hex, Message } from 'types';
import { useParams } from 'react-router-dom';
import { AnyJson } from '@polkadot/types/types';

type ChannelState = { Channel: Channel };
type ChannelsState = { AllChannels: Channel[] };
type SubscriptionState = { SubscribedToChannels: Hex[] };

// Router State wrapper
function useRouterState<T>(payload: AnyJson) {
  return useReadState<T>(ADDRESS.ROUTER_CONTRACT, routerMetaWasm, payload);
}

// Router message wrapper
function useRouterMessage() {
  return useSendMessage(ADDRESS.ROUTER_CONTRACT, routerMetaWasm);
}

function useChannel() {
  const { id } = useParams() as Params;
  const payload = useMemo(() => ({ Channel: id }), [id]);

  const { state } = useRouterState<ChannelState>(payload);

  return state?.Channel;
}

function useChannels() {
  const payload = useMemo(() => ({ AllChannels: null }), []);
  const { state } = useRouterState<ChannelsState>(payload);

  return state?.AllChannels;
}

function useSubscriptions() {
  const { account } = useAccount();
  const actorId = account?.decodedAddress;
  const payload = useMemo(() => ({ SubscribedToChannels: actorId }), [actorId]);

  const { state } = useRouterState<SubscriptionState>(payload);

  return state?.SubscribedToChannels;
}

function useMessages() {
  const [messages, setMessages] = useState<Message[] | null>();
  const [isStateRead, setIsStateRead] = useState(false);
  const apiRequest = new ServerRPCRequestService();

  const readState = () => {
    setIsStateRead(!isStateRead)
  }

  const { id } = useParams() as Params;
  const { api } = useApi();

  useEffect(() => {
    apiRequest
      .getResource('program.meta.get', { programId: id, chain: 'Workshop', genesis: GENESIS })
      .then(({ result: { metaFile } }) => Buffer.from(metaFile, 'base64'))
      .then((buffer) => api.programState.read(id, buffer))
      .then((state) => setMessages(state.toHuman() as Message[]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isStateRead]);

  return { messages, readState };
}

function useSubscribreActions() {
  const sendMessage = useRouterMessage();
  const { id } = useParams() as Params;

  const subscribe = (onSuccess: () => void) => {
    const payload = { AddSubscriberToChannel: id };

    sendMessage(payload, { onSuccess });
  };

  const unsubscribe = (onSuccess: () => void) => {
    const payload = { RemoveSubscriberFromChannel: id };

    sendMessage(payload, { onSuccess });
  };

  return { subscribe, unsubscribe };
}

export { useChannel, useChannels, useSubscriptions, useSubscribreActions, useMessages };
