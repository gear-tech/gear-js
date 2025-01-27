import { HexString } from '@gear-js/api';

type VerifyParameters = {
  build_idl: boolean;
  code_id: HexString;
  network: string;
  project: { Name: string } | { PathToCargoToml: string };
  repo_link: string;
  version: string;
};

type VerifyResponse = {
  id: string;
};

type StatusResponse = {
  status: 'pending' | 'verified' | 'failed' | 'in_progress';
  failed_reason: string | null;
  created_at: number;
};

type CodeResponse = {
  id: string;
  idl_hash: string | null;
  name: string;
  repo_link: string;
};

export type { VerifyParameters, VerifyResponse, StatusResponse, CodeResponse };
