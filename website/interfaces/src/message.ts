import { IBaseDBRecord } from './general';

export interface IMessage extends IBaseDBRecord<number | Date> {
  id: string;
  destination: string;
  source: string;
  payload?: string;
  error?: string;
  replyTo?: string;
  replyError?: string;
}
