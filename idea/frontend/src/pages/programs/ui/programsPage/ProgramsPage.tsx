import { useState } from 'react';

import { ProgramFilters, Programs, useProgramFilters, usePrograms } from '@/features/program';
import { SearchForm } from '@/shared/ui';

import styles from './ProgramsPage.module.scss';

const ProgramsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [defaultFilterValues, handleFiltersSubmit, filterParams] = useProgramFilters(searchQuery);
  const programs = usePrograms(filterParams);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Programs: {programs.data?.count}</h2>

      <SearchForm placeholder="Search by name, code hash, id..." onSubmit={setSearchQuery} />

      <Programs
        items={programs.data?.result}
        isLoading={programs.isLoading}
        hasMore={programs.hasNextPage}
        fetchMore={programs.fetchNextPage}
      />

      <ProgramFilters defaultValues={defaultFilterValues} onSubmit={handleFiltersSubmit} />
    </div>
  );
};

export { ProgramsPage };
