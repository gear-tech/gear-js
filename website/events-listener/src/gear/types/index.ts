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

interface HandleGearSystemEventParams {
  events: any;
  genesis: string;
  blockHash: string;
  timestamp: number;
}

type UpdateGearApiEventParams = UpdateMessageDataExtrinsic;

export { GenericApiData, UpdateMessageDataExtrinsic, ApiResult, HandleGearSystemEventParams, UpdateGearApiEventParams };
