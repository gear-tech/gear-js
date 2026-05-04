import DnsCardPlaceholder from './assets/dns-card-placeholder.svg?react';
import { useDns, useDnsFilters, useSingleDns } from './hooks';
import type { Dns } from './types';
import { AddAdmin, AdminCard, CreateDns, DeleteDns, DnsCard, EditDns } from './ui';

export type { Dns };
export {
  AddAdmin,
  AdminCard,
  CreateDns,
  DeleteDns,
  DnsCard,
  DnsCardPlaceholder,
  EditDns,
  useDns,
  useDnsFilters,
  useSingleDns,
};
