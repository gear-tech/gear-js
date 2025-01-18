import { DnsCard, CreateDns, DeleteDns, EditDns, AdminCard, AddAdmin } from './ui';
import DnsCardPlaceholder from './assets/dns-card-placeholder.svg?react';
import { useDns, useDnsFilters, useSingleDns } from './hooks';
import { Dns } from './types';

export {
  DnsCard,
  DnsCardPlaceholder,
  useDns,
  useDnsFilters,
  CreateDns,
  useSingleDns,
  DeleteDns,
  EditDns,
  AdminCard,
  AddAdmin,
};

export type { Dns };
