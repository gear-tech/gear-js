import { useState } from 'react';

import { ProgramFilters, Programs, useProgramFilters, usePrograms, useProgramsBatch } from '@/features/program';
import { SearchForm } from '@/shared/ui';

import styles from './ProgramsPage.module.scss';

const ProgramsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const resetSearch = () => setSearchQuery('');

  const [{ searchParams, vftParams, isBatch }, handleFiltersSubmit] = useProgramFilters(searchQuery, resetSearch);
  const searchPrograms = usePrograms(searchParams, !isBatch);
  const vftPrograms = useProgramsBatch(vftParams, isBatch);
  const programs = isBatch ? vftPrograms : searchPrograms;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Programs: {programs.data?.count}</h2>

      {isBatch ? <span /> : <SearchForm placeholder="Search by name, code hash, id..." onSubmit={setSearchQuery} />}

      <Programs
        items={programs.data?.result}
        isLoading={programs.isLoading}
        hasMore={'hasNextPage' in programs ? programs.hasNextPage : false}
        noItemsSubheading="You can start experimenting right now or try to build from examples. Let's Rock!"
        fetchMore={'fetchNextPage' in programs ? programs.fetchNextPage : () => {}}
      />

      <ProgramFilters onSubmit={handleFiltersSubmit} />
    </div>
  );
};

export { ProgramsPage };
