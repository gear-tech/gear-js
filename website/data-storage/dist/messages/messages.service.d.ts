import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { AddPayloadParams, AllMessagesResult, GetMessagesParams } from '@gear-js/backend-interfaces';
export declare class MessagesService {
  private readonly messageRepo;
  constructor(messageRepo: Repository<Message>);
  save({
    id,
    chain,
    genesis,
    destination,
    source,
    payload,
    date,
    replyTo,
    replyError,
    isRead,
  }: {
    id: any;
    chain: any;
    genesis: any;
    destination: any;
    source: any;
    payload: any;
    date: any;
    replyTo: any;
    replyError: any;
    isRead: any;
  }): Promise<Message>;
  addPayload(params: AddPayloadParams): Promise<Message>;
  getIncoming(params: GetMessagesParams): Promise<AllMessagesResult>;
  getOutgoing(params: GetMessagesParams): Promise<AllMessagesResult>;
  getAllMessages(params: GetMessagesParams): Promise<AllMessagesResult>;
  getCountUnread(destination: string): Promise<number>;
}
