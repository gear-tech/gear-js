import { OperationCallbacks, SignAndSendArg as CommonSignAndSendArg } from 'types/hooks';
import { UploadProgramModel } from 'types/program';

type UploadData = {
  file: File;
  programModel: UploadProgramModel;
  metadataBuffer: string | null;
};

export type UploadProgramParams = OperationCallbacks & UploadData;

export type SignAndUploadArg = CommonSignAndSendArg &
  UploadData & {
    programId: string;
  };
