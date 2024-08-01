import { useAccount } from '@gear-js/react-hooks';
import { useState } from 'react';

import { FilterGroup, Filters, Radio } from '@/features/filters';
import { Dns as DnsType, DnsCard, DnsCardPlaceholder, useDnsFilters, useDns, CreateDns } from '@/features/dns';
import { List, SearchForm, Skeleton } from '@/shared/ui';

import styles from './dns.module.scss';

const Dns = () => {
  const { account } = useAccount();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterValues, filterParams, handleFiltersSubmit] = useDnsFilters();

  const [dns, count, isLoading, hasMore, fetchMore, refetch] = useDns(searchQuery, filterParams);

  const renderDns = (dnsItem: DnsType) => <DnsCard dns={dnsItem} onSuccess={refetch} />;
  const renderSkeleton = () => <Skeleton SVG={DnsCardPlaceholder} disabled={true} />;

  return (
    <div className={styles.dns}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Decentralized DNS: {count}</h2>

        {!isLoading && <CreateDns onSuccess={refetch} />}
      </header>

      <SearchForm placeholder="Search by name, address" onSubmit={(query) => setSearchQuery(query)} />

      <List
        items={dns}
        isLoading={isLoading}
        hasMore={hasMore}
        noItems={{ heading: 'There are no DNS records yet.' }}
        renderItem={renderDns}
        fetchMore={fetchMore}
        renderSkeleton={renderSkeleton}
      />

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
