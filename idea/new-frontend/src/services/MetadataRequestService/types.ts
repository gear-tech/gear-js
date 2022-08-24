import { Hex } from '@gear-js/api';

type FetchMetadataResponse = {
  meta: string;
  metaFile: string;
  program: string;
};

type AddMedatataParams = {
  name: string;
  meta: string;
  title: string;
  metaFile: string;
  signature: Hex;
  programId: string;
};

export type { AddMedatataParams, FetchMetadataResponse };
