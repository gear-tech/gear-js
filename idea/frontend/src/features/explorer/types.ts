import { HexString } from '@gear-js/api';
import { Vec } from '@polkadot/types';
import { EventRecord } from '@polkadot/types/interfaces';

type FilterValues = { [filter: string]: boolean };

type FormattedUserMessageSentData = {
  message: {
    payload: string;
  };
  expiration: string | null;
};

type EventRecords = Vec<EventRecord>;

type FormattedSendMessageData = {
  destination: HexString;
  payload: string;
  gasLimit: string;
  value: string;
  prepaid: boolean;
};

type FormattedReplyMessageData = {
  replyToId: HexString;
  payload: string;
  gasLimit: string;
  value: string;
  prepaid: boolean;
};

export type {
  FilterValues,
  FormattedUserMessageSentData,
  EventRecords,
  FormattedSendMessageData,
  FormattedReplyMessageData,
};
