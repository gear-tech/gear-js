export interface DnsContractResponse {
  contract: string | null;
}

export interface DnsProgramResponse {
  id: string;
  name: string;
  address: string;
  admins: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetDnsProgramsResponse {
  data: DnsProgramResponse[];
  count: number;
}
