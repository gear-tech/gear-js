export enum CodeStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface CodeModel {
  id: string;
  name: string;
  status: CodeStatus;
  expiration: null | number;
  genesis: string;
  blockHash: string | null;
  timestamp: string;
}

export interface CodePaginationModel {
  count: number;
  listCode: CodeModel[];
}
