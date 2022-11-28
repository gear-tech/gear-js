import { Hex, Metadata } from '@gear-js/api';

type Params = {
  id: Hex;
};

type Channel = {
  id: Hex;
  name: string;
  ownerId: string;
  description: string;
};

type Message = {
  owner: string;
  text: string;
  timestamp: string;
};

type ChannelState = { Channel: Channel };
type ChannelsState = { AllChannels: Channel[] };
type SubscriptionState = { SubscribedToChannels: Array<Hex> };

type RPCError = {
  code: string;
  message: string;
  data: string;
};

type MetaResult = {
  meta: string;
  metaWasm: string;
  program: Hex;
}

type RPCmetaResponse = {
  id: number;
  jsonrpc: "2.0";
  result?: MetaResult;
  error?: RPCError;
}
type RPCSuccessResponse = {
  id: number;
  jsonrpc: "2.0";
  result: MetaResult;
}


export type { Params, Channel, Hex, Message, Metadata, ChannelState, ChannelsState, SubscriptionState, RPCSuccessResponse, RPCmetaResponse };
