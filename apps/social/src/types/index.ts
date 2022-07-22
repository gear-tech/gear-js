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

export type { Params, Channel, Hex, Message, Metadata };
