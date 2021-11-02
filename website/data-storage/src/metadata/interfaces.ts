export interface AddMetaParams {
  chain: string;
  programId: string;
  signature: string;
  meta: string | any;
  name: string;
  title: string;
}

export interface AddMetaResult {
  status: 'Metadata added';
}

export interface GetMetaParams {
  chain: string;
  programId: string;
}

export interface GetMetaResult {
  program: string;
  meta: string;
}
