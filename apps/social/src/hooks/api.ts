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
type SubscriptionState = { SubscribedToChannels: Array<Hex> };

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
  const { state, isStateRead } = useRouterState<ChannelsState>(payload);

  return { channels: state?.AllChannels, isStateRead }
}

function useSubscriptions() {
  const { account } = useAccount();
  const actorId = account?.decodedAddress;
  const payload = useMemo(() => ({ SubscribedToChannels: actorId }), [actorId]);

  const { state, isStateRead } = useRouterState<SubscriptionState>(payload);

  return { subscriptions: state?.SubscribedToChannels, readSubscriptions: isStateRead }
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

function useFeed() {
  const apiRequest = new ServerRPCRequestService();

  const [messages, setMessages] = useState<Message[] | null>();
  const { channels } = useChannels();
  const { api } = useApi();

  const promises = channels?.map(async ({ id }) => {
    const { result: { metaFile } } = await apiRequest.getResource('program.meta.get', { programId: id, chain: 'Workshop', genesis: GENESIS })
    const buffer = Buffer.from(metaFile, 'base64');
    const state = await api.programState.read(id, buffer);

    return state.toHuman();
  })

  useEffect(() => {
    if (promises) Promise.all(promises!).then((result) => {
      const msg = result.flat() as Message[];
      const sorted = msg.sort((prev, next) => parseInt(prev.timestamp.replaceAll(',', '')) - parseInt(next.timestamp.replaceAll(',', '')))
      setMessages(sorted.reverse())
    })

  }, [promises])

  return messages
}

function useOwnFeed() {
  const apiRequest = new ServerRPCRequestService();

  const [messages, setMessages] = useState<Message[] | null>();
  const { subscriptions } = useSubscriptions();
  const { api } = useApi();

  const promises = subscriptions?.map(async (id) => {
    const { result: { metaFile } } = await apiRequest.getResource('program.meta.get', { programId: id, chain: 'Workshop', genesis: GENESIS })
    const buffer = Buffer.from(metaFile, 'base64');
    const state = await api.programState.read(id, buffer);

    return state.toHuman();
  })

  useEffect(() => {
    if (promises) Promise.all(promises!).then((result) => {
      const msg = result.flat() as Message[];
      const sorted = msg.sort((prev, next) => parseInt(prev.timestamp.replaceAll(',', '')) - parseInt(next.timestamp.replaceAll(',', '')))
      setMessages(sorted.reverse())
    })

  }, [promises])

  return messages
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
    const payload = { Subscribe: "Null" };
    sendMessage(payload, { onSuccess });
  };

  const unsubscribe = (onSuccess?: () => void) => {
    const payload = { Unsubscribe: "Null" };
    sendMessage(payload, { onSuccess });
  };

  return { post, subscribe, unsubscribe };
}

export { useChannel, useChannels, useSubscriptions, useChannelActions, useMessages, useOwnFeed, useFeed };
