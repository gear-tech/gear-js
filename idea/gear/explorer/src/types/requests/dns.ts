export interface ParamGetDnsContract {
  genesis: string;
}

export interface ParamGetDnsPrograms {
  genesis: string;
  search?: string;
  createdBy?: string;
  limit?: number;
  offset?: number;
  orderByField?: string;
  orderByDirection?: 'ASC' | 'DESC';
}

export interface ParamGetDnsByName {
  genesis: string;
  name: string;
}

export interface ParamGetDnsByAddress {
  genesis: string;
  address: string;
}
