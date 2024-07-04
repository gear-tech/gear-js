import { useAccount } from '@gear-js/react-hooks';
import { useState } from 'react';

import { Placeholder } from '@/entities/placeholder';
import { FilterGroup, Filters, Radio } from '@/features/filters';
import { SortBy } from '@/features/sortBy';
import {
  Dns as DnsType,
  DnsCard,
  DnsCardPlaceholder,
  useDnsFilters,
  useDns,
  CreateDns,
  useDnsSort,
  useInitDnsProgram,
} from '@/features/dns';
import { List, SearchForm, Skeleton } from '@/shared/ui';

import styles from './dns.module.scss';

const Dns = () => {
  const { account } = useAccount();
  useInitDnsProgram();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterValues, filterParams, handleFiltersSubmit] = useDnsFilters();
  const [sortValues, toggleDirection] = useDnsSort();

  const [dns, count, isLoading, hasMore, fetchMore, refetch] = useDns(searchQuery, filterParams, sortValues);
  const isEmpty = !(isLoading || count);
  const isLoaderVisible = isEmpty || (!count && isLoading);

  const renderDns = (dnsItem: DnsType) => <DnsCard dns={dnsItem} onSuccess={refetch} />;
  const renderSkeleton = () => <Skeleton SVG={DnsCardPlaceholder} disabled={true} />;

  return (
    <div className={styles.dns}>
      <header className={styles.header}>
        <SortBy count={count} title="dDNS" onChange={() => toggleDirection()} />

        <CreateDns onSuccess={refetch} />
      </header>

      <SearchForm placeholder="Search by name, address" onSubmit={(query) => setSearchQuery(query)} />

      {isLoaderVisible ? (
        <div className={styles.placeholder}>
          <Placeholder block={renderSkeleton()} title="There are no dns yet" blocksCount={5} isEmpty={isEmpty} />
        </div>
      ) : (
        <List items={dns} hasMore={hasMore} renderItem={renderDns} fetchMore={fetchMore} />
      )}

      <Filters initialValues={filterValues} onSubmit={handleFiltersSubmit}>
        <FilterGroup name="owner" onSubmit={handleFiltersSubmit}>
          <Radio name="owner" value="all" label="All DNS" onSubmit={handleFiltersSubmit} />
          {account && <Radio name="owner" value="owner" label="My DNS" onSubmit={handleFiltersSubmit} />}
        </FilterGroup>
      </Filters>
    </div>
  );
};

export { Dns };
