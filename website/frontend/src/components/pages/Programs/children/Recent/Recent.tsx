import React, { useEffect, useState, VFC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProgramModel } from 'types/program';

import { INITIAL_LIMIT_BY_PAGE, LOCAL_STORAGE } from 'consts';

import { ProgramsLegend } from 'components/pages/Programs/children/ProgramsLegend/ProgramsLegend';
import { Pagination } from 'components/Pagination/Pagination';

import styles from './Recent.module.scss';
import { UserProgram } from '../UserProgram/UserProgram';

import { SearchForm } from '../../../../blocks/SearchForm/SearchForm';
import { getUserPrograms } from 'services';

export const Recent: VFC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageFromUrl = searchParams.has('page') ? Number(searchParams.get('page')) : 1;

  const [programs, setPrograms] = useState<ProgramModel[]>([]);
  const [programsCount, setProgramsCount] = useState(0);

  const [term, setTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  const onPageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    const programParams = {
      owner: localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW),
      limit: INITIAL_LIMIT_BY_PAGE,
      offset: (currentPage - 1) * INITIAL_LIMIT_BY_PAGE,
      term,
    };

    getUserPrograms(programParams).then(({ result }) => {
      setPrograms(result.programs);
      setProgramsCount(result.count);
    });
  }, [currentPage, term]);

  return (
    <div className={styles.blockList}>
      <div className={styles.paginationWrapper}>
        <span>Total results: {programsCount || 0}</span>
        <Pagination page={currentPage} count={programsCount || 1} onPageChange={onPageChange} />
      </div>
      <div>
        <SearchForm
          handleRemoveQuery={() => {
            setTerm('');
          }}
          handleSearch={(val: string) => {
            setTerm(val);
          }}
          placeholder="Find program"
        />
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
          <Pagination page={currentPage} count={programsCount} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};
