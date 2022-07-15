import { API_METHODS, UpdateMessageParams } from '@gear-js/common';
import { ExtrinsicStatus, SignedBlock } from '@polkadot/types/interfaces';

type ApiHandlerResult = UpdateMessageParams[];

interface UpdateMessageDataExtrinsic {
  signedBlock: SignedBlock;
  events: any;
  status: ExtrinsicStatus;
  genesis: string;
}

type GenericApiData = UpdateMessageDataExtrinsic;

interface ApiResult {
  method: API_METHODS;
  params: ApiHandlerResult;
}

enum API_HANDLE_METHODS {
  MessageEnqueued = API_METHODS.MESSAGE_UPDATE_DATA,
}

export { GenericApiData, UpdateMessageDataExtrinsic, ApiResult, API_HANDLE_METHODS };
