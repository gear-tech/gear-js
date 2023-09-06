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

type FormattedMessageQueuedData = {
  data: {
    destination: HexString;
  };
};

type FormattedSendData = { payload: string; gasLimit: string; value: string; prepaid: boolean };
type FormattedSendMessageData = FormattedSendData & { destination: HexString };
type FormattedSendReplyData = FormattedSendData & { replyToId: HexString };

type FormattedProgramData = { salt: HexString; initPayload: HexString; gasLimit: string; value: string };
type FormattedUploadProgramData = FormattedProgramData & { code: HexString };
type FormattedCreateProgramData = FormattedProgramData & { codeId: HexString };

type EventRecords = Vec<EventRecord>;

export type {
  FilterValues,
  FormattedUserMessageSentData,
  FormattedMessageQueuedData,
  FormattedSendMessageData,
  FormattedSendReplyData,
  FormattedUploadProgramData,
  FormattedCreateProgramData,
  EventRecords,
};
