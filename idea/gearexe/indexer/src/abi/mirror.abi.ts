import { LogEvent } from './abi.support';
import * as ethers from 'ethers';
import * as fs from 'fs';
import { config } from '../config';
import path from 'path';

const ABI_JSON = JSON.parse(fs.readFileSync(path.join(config.apiPath, 'IMirror.json'), 'utf-8'));

export const abi = new ethers.Interface(ABI_JSON.abi);

export const events = {
  StateChanged: new LogEvent<[stateHash: string] & { stateHash: string }>(abi, abi.getEvent('StateChanged')!.topicHash),
  MessageQueueingRequested: new LogEvent<
    [id: string, source: string, payload: string, value: string, callReply: boolean] & {
      id: string;
      source: string;
      payload: string;
      value: string;
      callReply: boolean;
    }
  >(abi, abi.getEvent('MessageQueueingRequested')!.topicHash),
  ReplyQueueingRequested: new LogEvent<
    [repliedTo: string, source: string, payload: string, value: string] & {
      repliedTo: string;
      source: string;
      payload: string;
      value: string;
    }
  >(abi, abi.getEvent('ReplyQueueingRequested')!.topicHash),
  ValueClaimingRequested: new LogEvent<[claimedId: string, source: string] & { claimedId: string; source: string }>(
    abi,
    abi.getEvent('ValueClaimingRequested')!.topicHash,
  ),
  ExecutableBalanceTopUpRequested: new LogEvent<[value: string] & { value: string }>(
    abi,
    abi.getEvent('ExecutableBalanceTopUpRequested')!.topicHash,
  ),
  Message: new LogEvent<
    [id: string, destination: string, payload: string, value: string] & {
      id: string;
      destination: string;
      payload: string;
      value: string;
    }
  >(abi, abi.getEvent('Message')!.topicHash),
  MessageCallFailed: new LogEvent<
    [id: string, destination: string, value: string] & { id: string; destination: string; value: string }
  >(abi, abi.getEvent('MessageCallFailed')!.topicHash),
  Reply: new LogEvent<
    [payload: string, value: string, replyTo: string, replyCode: string] & {
      payload: string;
      value: string;
      replyTo: string;
      replyCode: string;
    }
  >(abi, abi.getEvent('Reply')!.topicHash),
  ReplyCallFailed: new LogEvent<
    [value: string, replyTo: string, replyCode: string] & { value: string; replyTo: string; replyCode: string }
  >(abi, abi.getEvent('ReplyCallFailed')!.topicHash),
  ValueClaimed: new LogEvent<[claimedId: string, value: string] & { claimedId: string; value: string }>(
    abi,
    abi.getEvent('ValueClaimed')!.topicHash,
  ),
};
