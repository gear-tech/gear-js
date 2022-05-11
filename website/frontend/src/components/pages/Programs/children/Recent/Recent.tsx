import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GearKeyring } from '@gear-js/api';

import styles from './Recent.module.scss';
import { UserProgram } from '../UserProgram/UserProgram';
import { ProgramsLegend } from '../ProgramsLegend/ProgramsLegend';

import { useAccount, useChangeEffect } from 'hooks';
import { ProgramModel } from 'types/program';
import { UserPrograms } from 'types/common';
import { getUserPrograms } from 'services';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import { Pagination } from 'components/Pagination/Pagination';
import { SearchForm } from 'components/blocks/SearchForm/SearchForm';

export const Recent = () => {
  const location = useLocation();
  const { account } = useAccount();

  const searchParams = new URLSearchParams(location.search);
  const pageFromUrl = searchParams.has('page') ? Number(searchParams.get('page')) : 1;

  const [programs, setPrograms] = useState<ProgramModel[]>([]);
  const [programsCount, setProgramsCount] = useState(0);

  const [term, setTerm] = useState('');
  const [page, setPage] = useState(pageFromUrl);

  const handleSearch = (currentTerm: string) => {
    setTerm(currentTerm);
    setPage(1);
  };

  const handleRemoveQuery = () => {
    setTerm('');
    setPage(1);
  };

  useChangeEffect(handleRemoveQuery, [account]);

  useEffect(() => {
    if (account) {
      const params: UserPrograms = {
        term,
        owner: GearKeyring.decodeAddress(account.address),
        limit: INITIAL_LIMIT_BY_PAGE,
        offset: (page - 1) * INITIAL_LIMIT_BY_PAGE,
      };

      getUserPrograms(params).then(({ result }) => {
        setPrograms(result.programs);
        setProgramsCount(result.count);
      });
    }
  }, [page, term, account]);

  return (
    <div className={styles.blockList}>
      <div className={styles.paginationWrapper}>
        <span>Total results: {programsCount || 0}</span>
        <Pagination page={page} count={programsCount || 1} onPageChange={setPage} />
      </div>
      <div>
        <SearchForm placeholder="Find program" handleSearch={handleSearch} handleRemoveQuery={handleRemoveQuery} />
        <br />
      </div>
      <ProgramsLegend />
      <div>
        {programs.map((program: ProgramModel) => (
          <UserProgram key={program.id} program={program} />
        ))}
      </div>
      {programsCount > 0 && (
        <div className={styles.paginationBottom}>
          <Pagination page={page} count={programsCount} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};
