import { useEffect, useState, useMemo } from 'react';
import { useReadState, useSendMessage, useAccount, useApi } from '@gear-js/react-hooks';
import { routerMetaWasm } from 'assets/wasm';
import { getWasmMetadata } from '@gear-js/api';
import { ADDRESS } from 'consts';
import { ServerRPCRequestService } from 'services';
import {
  Params,
  Message,
  Metadata,
  ChannelState,
  ChannelsState,
  SubscriptionState,
  RPCmetaResponse,
  RPCSuccessResponse,
  Hex,
} from 'types';
import { useParams } from 'react-router-dom';
import { AnyJson } from '@polkadot/types/types';

// Router State wrapper
function useRouterState<T>(payload: AnyJson) {
  return useReadState<T>(ADDRESS.ROUTER_CONTRACT, routerMetaWasm, payload);
}

// Get channel info
function useChannel() {
  const { id } = useParams() as Params;
  const payload = useMemo(() => ({ Channel: id }), [id]);

  const { state } = useRouterState<ChannelState>(payload);

  return state?.Channel;
}

// Get channel list
function useChannels() {
  const payload = useMemo(() => ({ AllChannels: null }), []);
  const { state, isStateRead } = useRouterState<ChannelsState>(payload);

  return { channels: state?.AllChannels, isStateRead };
}

// Get id's of subscribed channels
function useSubscriptions() {
  const { account } = useAccount();
  const actorId = account?.decodedAddress;
  const payload = useMemo(() => actorId ? ({ SubscribedToChannels: actorId }) : undefined, [actorId]);

  const { state, isStateRead } = useRouterState<SubscriptionState>(payload);

  return { subscriptions: state?.SubscribedToChannels, readSubscriptions: isStateRead };
}

// Get meta information from Meta storage using RPC request
function usePRCMeta(ids: Hex[] | undefined) {
  const [programMeta, setProgramMeta] = useState<any[] | null>();
  const apiRequest = new ServerRPCRequestService();
  const { api } = useApi();
  const genesis = api.genesisHash.toHex();

  const getMeta = async () => {
    if (ids) {
      const batchParams = ids.map((id) => ({
        programId: id,
        genesis,
      }));

      const response = await apiRequest.getResource('program.meta.get', batchParams);
      const promises = response
        .filter((res: RPCmetaResponse) => res.result)
        .map(({ result: { program, metaWasm } }: RPCSuccessResponse) => ({
          program,
          metaWasm,
        }));

      const metaArr = await Promise.all(promises);
      setProgramMeta(metaArr);
    }
  };

  useEffect(() => {
    getMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  return programMeta;
}

// Get messages on channel page
function useMessages() {
  const [messages, setMessages] = useState<Message[] | null>();

  const { id } = useParams() as Params;
  const { api } = useApi();
  const idArr = useMemo(() => [id], [id]);
  const programMeta = usePRCMeta(idArr);

  useEffect(() => {
    if (programMeta) {
      const [{ metaWasm }] = programMeta;
      const buffer = Buffer.from(metaWasm, 'base64');

      api.programState.read(id, buffer).then((state) => setMessages(state.toHuman() as Message[]));
    }
  }, [id, programMeta, api.programState]);

  return { messages };
}

// Auxiliary hook for receiving a message feed by ids
function useFeed(ids: Hex[] | undefined) {
  const [messages, setMessages] = useState<Message[] | null>();
  const { api } = useApi();
  const programMeta = usePRCMeta(ids);

  useEffect(() => {
    const getMessges = async () => {
      if (programMeta) {
        const promises = programMeta.map(async ({ program, metaWasm }: any) => {
          const buffer = Buffer.from(metaWasm, 'base64');
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
      }
    };

    getMessges();
  }, [programMeta, api.programState]);

  return messages;
}

// Get messages all channels
function useGeneralFeed() {
  const [messages, setMessages] = useState<Message[] | null>();
  const { channels } = useChannels();
  const ids = useMemo(() => channels?.map(({ id }) => id), [channels]);
  const feed = useFeed(ids);

  useEffect(() => {
    if (feed) {
      setMessages(feed);
    }
  }, [feed]);

  return messages;
}

// Get messages on subscribed channels
function useOwnFeed() {
  const [messages, setMessages] = useState<Message[] | null>();
  const { subscriptions } = useSubscriptions();
  const ids = useMemo(() => subscriptions?.map((id) => id), [subscriptions]);
  const feed = useFeed(ids);

  useEffect(() => {
    if (feed) {
      setMessages(feed);
    }
  }, [feed]);

  return messages;
}

// Make transation action: post, subscribe, unsubscribe
function useChannelActions() {
  const [metadata, setMetadata] = useState<Metadata>();

  const { id } = useParams() as Params;
  const idArr = useMemo(() => [id], [id]);
  const programMeta = usePRCMeta(idArr);

  useEffect(() => {
    if (programMeta) {
      const [{ metaWasm }] = programMeta;
      const buffer = Buffer.from(metaWasm, 'base64');
      getWasmMetadata(buffer).then((m) => setMetadata(m));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programMeta]);

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

export { useChannel, useChannels, useSubscriptions, useChannelActions, useMessages, useOwnFeed, useGeneralFeed };
