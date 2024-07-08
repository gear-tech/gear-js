import { useAccount } from '@gear-js/react-hooks';
import { useState } from 'react';

import { Placeholder } from '@/entities/placeholder';
import { FilterGroup, Filters, Radio } from '@/features/filters';
import {
  Dns as DnsType,
  DnsCard,
  DnsCardPlaceholder,
  useDnsFilters,
  useDns,
  CreateDns,
  useInitDnsProgram,
} from '@/features/dns';
import { List, SearchForm, Skeleton } from '@/shared/ui';

import styles from './dns.module.scss';

const Dns = () => {
  const { account } = useAccount();
  useInitDnsProgram();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterValues, filterParams, handleFiltersSubmit] = useDnsFilters();

  const [dns, count, isLoading, hasMore, fetchMore, refetch] = useDns(searchQuery, filterParams);
  const isEmpty = !(isLoading || count);
  const isLoaderVisible = isEmpty || (!count && isLoading);

  const renderDns = (dnsItem: DnsType) => <DnsCard dns={dnsItem} onSuccess={refetch} />;
  const renderSkeleton = () => <Skeleton SVG={DnsCardPlaceholder} disabled={true} />;

  return (
    <div className={styles.dns}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Decentralized DNS: {count}</h2>

        {!isEmpty && <CreateDns onSuccess={refetch} />}
      </header>

      <SearchForm placeholder="Search by name, address" onSubmit={(query) => setSearchQuery(query)} />

      {isLoaderVisible ? (
        <div className={styles.placeholder}>
          <Placeholder
            block={renderSkeleton()}
            title="There is no dDNS yet"
            description="Create a new dDNS right now."
            blocksCount={5}
            isEmpty={isEmpty}>
            <CreateDns onSuccess={refetch} color="primary" />
          </Placeholder>
        </div>
      ) : (
        <List items={dns} hasMore={hasMore} renderItem={renderDns} fetchMore={fetchMore} />
      )}

      <Filters initialValues={filterValues} onSubmit={handleFiltersSubmit} title="Sort & Filter">
        <FilterGroup name="orderByDirection" onSubmit={handleFiltersSubmit}>
          <Radio name="orderByDirection" value="DESC" label="Newest first" onSubmit={handleFiltersSubmit} />
          {account && <Radio name="orderByDirection" value="ASC" label="Oldest first" onSubmit={handleFiltersSubmit} />}
        </FilterGroup>

        <FilterGroup name="owner" onSubmit={handleFiltersSubmit} title="dDNS ownership">
          <Radio name="owner" value="all" label="All DNS" onSubmit={handleFiltersSubmit} />
          {account && <Radio name="owner" value="owner" label="My DNS" onSubmit={handleFiltersSubmit} />}
        </FilterGroup>
      </Filters>
    </div>
  );
};

export { Dns };
