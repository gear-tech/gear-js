import { useEffect, useState } from 'react';

import { ProgramFilters, Programs, useProgramFilters, usePrograms } from '@/features/program';
import { SearchForm } from '@/shared/ui';

import styles from './ProgramsPage.module.scss';
import { useSearchParams } from 'react-router-dom';

const ProgramsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams, { replace: true });
  }, [searchQuery]);
  const [defaultFilterValues, handleFiltersSubmit, filterParams] = useProgramFilters(searchQuery);
  const programs = usePrograms(filterParams);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Programs: {programs.data?.count}</h2>

      <SearchForm placeholder="Search by name, code hash, id..." query={searchQuery} onSubmit={setSearchQuery} />

      <Programs
        items={programs.data?.result}
        isLoading={programs.isLoading}
        hasMore={programs.hasNextPage}
        noItemsSubheading="You can start experimenting right now or try to build from examples. Let's Rock!"
        fetchMore={programs.fetchNextPage}
      />

      <ProgramFilters defaultValues={defaultFilterValues} onSubmit={handleFiltersSubmit} />
    </div>
  );
};

export { ProgramsPage };
