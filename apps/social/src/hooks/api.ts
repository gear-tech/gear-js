import { useEffect, useState, useMemo } from 'react';
import { useReadState, useSendMessage, useAccount, useApi } from '@gear-js/react-hooks';
import { routerMetaWasm } from 'assets/wasm';
import { getWasmMetadata } from '@gear-js/api';
import { ADDRESS } from 'consts';
import { ServerRPCRequestService } from 'services';
import { Params, Message, Metadata, ChannelState, ChannelsState, SubscriptionState, RPCmetaResponse, RPCSuccessResponse } from 'types';
import { useParams } from 'react-router-dom';
import { AnyJson } from '@polkadot/types/types';

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

  return { channels: state?.AllChannels, isStateRead };
}

function useSubscriptions() {
  const { account } = useAccount();
  const actorId = account?.decodedAddress;
  const payload = useMemo(() => ({ SubscribedToChannels: actorId }), [actorId]);

  const { state, isStateRead } = useRouterState<SubscriptionState>(payload);

  return { subscriptions: state?.SubscribedToChannels, readSubscriptions: isStateRead };
}

function useMessages() {
  const [messages, setMessages] = useState<Message[] | null>();
  const apiRequest = new ServerRPCRequestService();

  const { id } = useParams() as Params;
  const { api } = useApi();

  useEffect(() => {
    const genesis = api.genesisHash.toHex();

    apiRequest
      .getResource('program.meta.get', [{ programId: id, genesis }])
      .then(
        ([
          {
            result: { metaFile },
          },
        ]) => Buffer.from(metaFile, 'base64'),
      )
      .then((buffer) => api.programState.read(id, buffer))
      // TODO: replace w/ `useReadState` hook after `@gear-js/api` update with ability to read state using meta buffer
      .then((state) => setMessages(state.toHuman() as Message[]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { messages };
}

function useFeed() {
  const [messages, setMessages] = useState<Message[] | null>();
  const { channels } = useChannels();
  const { api } = useApi();

  useEffect(() => {
    const getMessges = async () => {
      const apiRequest = new ServerRPCRequestService();
      const genesis = api.genesisHash.toHex();

      const batchParams = channels!.map(({ id }) => ({
        programId: id,
        genesis
      }));

      const response = await apiRequest.getResource('program.meta.get', batchParams);

      const promises = response
        .filter((res: RPCmetaResponse) => res.result)
        .map(async ({ result: { program, metaFile } }: RPCSuccessResponse) => {
          const buffer = Buffer.from(metaFile, 'base64');
          const state = await api.programState.read(program, buffer);

          return state.toHuman();
        });

      const messagaArr = await Promise.all(promises);
      const msg = messagaArr.flat() as Message[];
      const sorted = msg.sort(
        (prev, next) =>
          parseInt(next.timestamp.replaceAll(',', ''), 10) - parseInt(prev.timestamp.replaceAll(',', ''), 10),
      );
      setMessages(sorted);
    };

    if (channels) getMessges();
  }, [channels, api.programState, api.genesisHash]);

  return messages;
}

function useOwnFeed() {
  const [messages, setMessages] = useState<Message[] | null>();
  const { subscriptions } = useSubscriptions();
  const { api } = useApi();

  useEffect(() => {
    const getMessges = async () => {
      const apiRequest = new ServerRPCRequestService();
      const genesis = api.genesisHash.toHex();

      const batchParams = subscriptions!.map((id) => ({
        programId: id,
        genesis
      }));

      const response = await apiRequest.getResource('program.meta.get', batchParams);

      const promises = response
        .filter((res: RPCmetaResponse) => res.result)
        .map(async ({ result: { program, metaFile } }: RPCSuccessResponse) => {
          const buffer = Buffer.from(metaFile, 'base64');
          const state = await api.programState.read(program, buffer);

          return state.toHuman();
        });

      const messagaArr = await Promise.all(promises);
      const msg = messagaArr.flat() as Message[];
      const sorted = msg.sort(
        (prev, next) =>
          parseInt(next.timestamp.replaceAll(',', ''), 10) - parseInt(prev.timestamp.replaceAll(',', ''), 10),
      );
      setMessages(sorted);
    };

    if (subscriptions) getMessges();
  }, [subscriptions, api.programState, api.genesisHash]);

  return messages;
}

function useChannelActions() {
  const apiRequest = new ServerRPCRequestService();
  const [metadata, setMetadata] = useState<Metadata>();

  const { id } = useParams() as Params;
  const { api } = useApi();
  const genesis = api.genesisHash.toHex();

  useEffect(() => {
    apiRequest
      .getResource('program.meta.get', [{ programId: id, genesis }])
      .then(
        ([
          {
            result: { metaFile },
          },
        ]) => Buffer.from(metaFile, 'base64'),
      )
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
    const payload = { Subscribe: null };
    sendMessage(payload, { onSuccess });
  };

  const unsubscribe = (onSuccess?: () => void) => {
    const payload = { Unsubscribe: null };
    sendMessage(payload, { onSuccess });
  };

  return { post, subscribe, unsubscribe };
}

export { useChannel, useChannels, useSubscriptions, useChannelActions, useMessages, useOwnFeed, useFeed };
