import { HexString } from '@gear-js/api';
import { FIELD_NAME } from './consts';

type Values = {
  [FIELD_NAME.DNS_ADDRESS]: string;
  [FIELD_NAME.DNS_NAME]: string;
};

type Dns = {
  id: string; // same as 'name' at contract
  name: string;
  address: HexString; // same as 'program_id' at contract
  admin: HexString | null;
  createdBy: HexString;
  createdAt: string;
  updatedAt: string;
};

type SortDirection = 'ASC' | 'DESC';
type DnsParams = {
  limit: number;
  offset: number;
  createdBy?: string;
  search?: string;
  orderByField: string;
  orderByDirection: SortDirection;
};

type DnsFilterParams = Pick<DnsParams, 'createdBy' | 'orderByDirection' | 'orderByField'>;

type DnsResponse = {
  data: Dns[];
  count: number;
};

export type { Values, Dns, DnsParams, DnsResponse, DnsFilterParams, SortDirection };
