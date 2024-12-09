import { useAccount } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { CodeCard, useCodes, Code } from '@/features/code';
import { LocalCode, useLocalCodes } from '@/features/local-indexer';
import { Filters, FilterGroup, Radio } from '@/features/filters';
import { useChain } from '@/hooks';
import { List, SearchForm, Skeleton } from '@/shared/ui';

import CardPlaceholderSVG from '@/shared/assets/images/placeholders/card.svg?react';

import styles from './Codes.module.scss';
import { useSearchParams } from 'react-router-dom';

const DEFAULT_FILTER_VALUES = {
  owner: 'all',
};

const Codes = () => {
  const { account } = useAccount();
  const { isDevChain } = useChain();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filterValues, setFilterValues] = useState(() => {
    return {
      owner: searchParams.get('owner') || DEFAULT_FILTER_VALUES.owner,
    };
  });

  useEffect(() => {
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    } else {
      searchParams.delete('search');
    }

    if (filterValues.owner) {
      searchParams.set('owner', filterValues.owner);
    } else {
      searchParams.delete('owner');
    }
    setSearchParams(searchParams, { replace: true });
  }, [searchQuery, filterValues]);

  const filterParams = {
    query: searchQuery,
    uploadedBy: filterValues.owner === 'user' ? account?.decodedAddress : undefined,
  };

  const storageCodes = useCodes(filterParams);
  const localCodes = useLocalCodes(filterParams);
  const codes = isDevChain ? localCodes : storageCodes;

  const renderItem = (code: Code | LocalCode) => <CodeCard code={code} />;
  const renderSkeleton = () => <Skeleton SVG={CardPlaceholderSVG} disabled />;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Codes: {codes.data?.count}</h2>

      <SearchForm placeholder="Search by name, id..." query={searchQuery} onSubmit={setSearchQuery} />

      <List
        items={codes.data?.result}
        hasMore={codes.hasNextPage}
        isLoading={codes.isLoading}
        noItems={{
          heading: 'There are no codes yet.',
          subheading: "You can start experimenting right now or try to build from examples. Let's Rock!",
        }}
        fetchMore={codes.fetchNextPage}
        renderItem={renderItem}
        renderSkeleton={renderSkeleton}
      />

      {!isDevChain && (
        <Filters initialValues={DEFAULT_FILTER_VALUES} values={filterValues} onSubmit={setFilterValues}>
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
      )}
    </div>
  );
};

export { Codes };
