type VerifyParameters = {
  build_idl: boolean;
  code_id: string;
  network: string;
  project: { Name: string } | { PathToCargoToml: string };
  repo_link: string;
  version: string;
};

type StatusResponse = {
  status: 'pending' | 'verified' | 'failed';
  failed_reason: string;
  created_at: number;
};

export type { VerifyParameters, StatusResponse };
