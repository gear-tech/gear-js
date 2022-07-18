import { useEffect, useState, useMemo } from 'react';
import { useReadState, useSendMessage, useAccount, useApi } from '@gear-js/react-hooks';
import { routerMetaWasm } from 'assets/wasm';
import { getWasmMetadata } from '@gear-js/api';
import { ADDRESS, GENESIS } from 'consts';
import { ServerRPCRequestService } from 'services';
import { Params, Channel, Hex, Message, Metadata } from 'types';
import { useParams } from 'react-router-dom';
import { AnyJson } from '@polkadot/types/types';

type ChannelState = { Channel: Channel };
type ChannelsState = { AllChannels: Channel[] };
type SubscriptionState = { SubscribedToChannels: Hex[] };

// Router State wrapper
function useRouterState<T>(payload: AnyJson) {
  return useReadState<T>(ADDRESS.ROUTER_CONTRACT, routerMetaWasm, payload);
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
  const apiRequest = new ServerRPCRequestService();

  const { id } = useParams() as Params;
  const { api } = useApi();

  useEffect(() => {
    apiRequest
      .getResource('program.meta.get', { programId: id, chain: 'Workshop', genesis: GENESIS })
      .then(({ result: { metaFile } }) => Buffer.from(metaFile, 'base64'))
      .then((buffer) => api.programState.read(id, buffer))
      .then((state) => setMessages(state.toHuman() as Message[]));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { messages };
}

function useChannelActions() {
  const apiRequest = new ServerRPCRequestService();
  const [metadata, setMetadata] = useState<Metadata>();

  const { id } = useParams() as Params;

  useEffect(() => {
    apiRequest
      .getResource('program.meta.get', { programId: id, chain: 'Workshop', genesis: GENESIS })
      .then(({ result: { metaFile } }) => Buffer.from(metaFile, 'base64'))
      .then((buffer) => getWasmMetadata(buffer))
      .then((m) => setMetadata(m));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const sendMessage = useSendMessage(id, metadata);

  const post = (text: string, onSuccess?: () => void) => {
    const payload = { Post: text };
    sendMessage(payload, { onSuccess });
  };

  const subscribe = (onSuccess?: () => void) => {
    const payload = { AddSubscriberToChannel: id };
    sendMessage(payload, { onSuccess });
  };

  const unsubscribe = (onSuccess?: () => void) => {
    const payload = { RemoveSubscriberFromChannel: id };
    sendMessage(payload, { onSuccess });
  };

  return { post, subscribe, unsubscribe };
}

export { useChannel, useChannels, useSubscriptions, useChannelActions, useMessages };
