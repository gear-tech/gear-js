import { IMessage } from './message';

interface IHeader {
  height: number;
  hash: string;
  timestamp: string;
}

interface IEvent {
  args: {
    expiration: number;
    message: IMessage;
  };
  id: string;
  name: string;
  pos: number;
}

export interface IBatchResponse {
  batch: {
    header: IHeader;
    events: IEvent[];
  }[];
}
