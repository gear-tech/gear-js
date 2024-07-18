import { useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';

import { useCodes } from '@/features/code';
import { Filters, FilterGroup, Radio } from '@/features/filters';
import { List, SearchForm, Skeleton } from '@/shared/ui';
import { Code } from '@/features/code/api';
import { HorizontalCodeCard } from '@/entities/code';
import CardPlaceholderSVG from '@/shared/assets/images/placeholders/card.svg?react';

import styles from './Codes.module.scss';

const DEFAULT_FILTER_VALUES = {
  owner: 'all',
};

const Codes = () => {
  const { account } = useAccount();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterValues, setFilterValues] = useState(DEFAULT_FILTER_VALUES);

  const codes = useCodes({
    query: searchQuery,
    uploadedBy: filterValues.owner === 'user' ? account?.decodedAddress : undefined,
  });

  const renderItem = (code: Code) => <HorizontalCodeCard code={code} />;
  const renderSkeleton = () => <Skeleton SVG={CardPlaceholderSVG} disabled />;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Codes: {codes.data?.count}</h2>

      <SearchForm placeholder="Search by name, id..." onSubmit={setSearchQuery} className={styles.search} />

      <List
        items={codes.data?.result}
        hasMore={codes.hasNextPage}
        isLoading={codes.isLoading}
        fetchMore={codes.fetchNextPage}
        renderItem={renderItem}
        renderSkeleton={renderSkeleton}
      />

      <Filters initialValues={DEFAULT_FILTER_VALUES} onSubmit={setFilterValues}>
        <FilterGroup name="owner" onSubmit={setFilterValues}>
          <Radio name="owner" value="all" label="All codes" onSubmit={setFilterValues} />

          {account && (
            <Radio
              name="owner"
              value="user"
              label="My codes"
              className={styles.ownerFilter}
              onSubmit={setFilterValues}
            />
          )}
        </FilterGroup>
      </Filters>
    </div>
  );
};

export { Codes };
