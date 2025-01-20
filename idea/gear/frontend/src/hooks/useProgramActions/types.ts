import { IProgramCreateResult, IProgramUploadResult, ProgramMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

type Program = (IProgramCreateResult | IProgramUploadResult) & {
  codeId: HexString;
};

type ContractApi = {
  metadata?: {
    hash: HexString | null | undefined;
    hex: HexString | undefined;
    value: ProgramMetadata | undefined;
    isFromStorage: boolean;
  };

  sails?: {
    idl: string | undefined;
    isFromStorage: boolean;
  };
};

type Values = {
  value: string;
  gasLimit: string;
  payload: AnyJson;
  keepAlive: boolean;
  programName: string;
  payloadType?: string;
};

export type { Program, ContractApi, Values };
