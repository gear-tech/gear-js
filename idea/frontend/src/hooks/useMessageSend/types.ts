import { AddressOrPair, Signer } from '@polkadot/api/types';
import { GearApi, GearMessage, Metadata, GearMessageReply } from '@gear-js/api';
import { AlertContainerFactory } from '@gear-js/react-hooks';

import { OperationCallbacks } from 'types/hooks';
import { Message, Reply } from 'types/program';

export type SendMessageParams = OperationCallbacks & {
  message: Message & Reply;
  metadata?: Metadata;
  extrinsic: 'handle' | 'reply';
  payloadType?: string;
};

export type SignAndSendArg = OperationCallbacks & {
  api: GearApi;
  alert: AlertContainerFactory;
  signer: Signer;
  address: AddressOrPair;
  apiExtrinsic: GearMessage | GearMessageReply;
  transactionName: string;
};
