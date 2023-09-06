import { HexString } from '@gear-js/api';
import { Vec } from '@polkadot/types';
import { EventRecord } from '@polkadot/types/interfaces';

type FilterValues = { [filter: string]: boolean };

type FormattedUserMessageSentData = {
  message: {
    payload: string;
    source: HexString;
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

type FormattedUploadProgramMessage = {
  code: HexString;
  salt: HexString;
  initPayload: HexString;
  gasLimit: string;
  value: string;
};

type FormattedMessageQueued = {
  data: { destination: HexString };
};

export type {
  FilterValues,
  FormattedUserMessageSentData,
  EventRecords,
  FormattedSendMessageData,
  FormattedReplyMessageData,
  FormattedUploadProgramMessage,
  FormattedMessageQueued,
};
