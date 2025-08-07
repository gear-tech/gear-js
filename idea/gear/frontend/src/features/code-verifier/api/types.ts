import { HexString } from '@gear-js/api';

type VerifyParameters = {
  base_path: string;
  build_idl: boolean;
  code_id: HexString;
  network: string;
  project: { Package: string } | { ManifestPath: string };
  repo_link: string;
  version: string;
};

type VerifyResponse = {
  id: string;
};

type StatusResponse = {
  status: 'pending' | 'verified' | 'failed' | 'in_progress';
  created_at: number;
  code_id: string;
  repo_link: string;
  version: string;
  failed_reason: string | null;
  project_name: string | null;
  manifest_path: string | null;
  base_path: string | null;
};

type CodeResponse = {
  id: string;
  idl_hash: string | null;
  name: string;
  repo_link: string;
};

export type { VerifyParameters, VerifyResponse, StatusResponse, CodeResponse };
