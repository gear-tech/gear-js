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

export type { Params, Channel, Hex, Message, Metadata, ChannelState, ChannelsState, SubscriptionState };
