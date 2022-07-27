import { Account } from '@gear-js/react-hooks';

import { OperationCallbacks, SignAndSendArg as CommonSignAndSendArg } from 'types/hooks';
import { UploadProgramModel } from 'types/program';

type UploadData = {
  file: File;
  programModel: UploadProgramModel;
  metadataBuffer: string | null;
};

export type UploadProgramParams = OperationCallbacks & UploadData;

export type SignAndUploadArg = Omit<CommonSignAndSendArg, 'address'> &
  UploadData & {
    account: Account;
    programId: string;
  };
