import React, { useEffect, useState, VFC } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ProgramModel } from 'types/program';

import { INITIAL_LIMIT_BY_PAGE, LOCAL_STORAGE } from 'consts';

import { ProgramsLegend } from 'components/pages/Programs/children/ProgramsLegend/ProgramsLegend';
import { Meta } from 'components/Meta/Meta';
import { Pagination } from 'components/Pagination/Pagination';

import styles from './Recent.module.scss';
import { UserProgram } from '../UserProgram/UserProgram';

import { SearchForm } from '../../../../blocks/SearchForm/SearchForm';
import { getUserPrograms } from 'services';

type ProgramMessageType = {
  programName: string;
  programId: string;
};

export const Recent: VFC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageFromUrl = searchParams.has('page') ? Number(searchParams.get('page')) : 1;
  const queryFromUrl = searchParams.has('query') ? String(searchParams.get('query')) : '';

  const [programs, setPrograms] = useState<ProgramModel[]>([]);
  const [programsCount, setProgramsCount] = useState(0);

  const [query, setQuery] = useState(queryFromUrl);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [programMeta, setProgramMeta] = useState<ProgramMessageType | null>(null);

  const onPageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    const programParams = {
      owner: localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW),
      limit: INITIAL_LIMIT_BY_PAGE,
      offset: (currentPage - 1) * INITIAL_LIMIT_BY_PAGE,
      term: query,
    };

    getUserPrograms(programParams).then(({ result }) => {
      setPrograms(result.programs);
      setProgramsCount(result.count);
    });
  }, [currentPage, query]);

  const handleOpenForm = (programId: string, programName?: string) => {
    if (programName) {
      setProgramMeta({
        programId,
        programName,
      });
    }
  };

  const handleCloseMetaForm = () => {
    setProgramMeta(null);
  };

  if (programMeta) {
    return (
      <Meta programId={programMeta.programId} programName={programMeta.programName} handleClose={handleCloseMetaForm} />
    );
  }

  const handleSearch = (value: string) => {
    const path = `/uploaded-programs/?page=1${value ? `&query=${value}` : ``}`;

    setQuery(value);
    setCurrentPage(1);
    navigate(path);
  };

  return (
    <div className={styles.blockList}>
      <div className={styles.paginationWrapper}>
        <span>Total results: {programsCount || 0}</span>
        <Pagination page={currentPage} count={programsCount || 1} onPageChange={onPageChange} />
      </div>
      <div>
        <SearchForm query={query} placeholder="Find program" handleSearch={handleSearch} />
        <br />
      </div>
      <ProgramsLegend />
      {(programs && programsCount && (
        <div>
          {programs.map((program: ProgramModel) => (
            <UserProgram program={program} handleOpenForm={handleOpenForm} key={program.id} />
          ))}
        </div>
      )) ||
        null}

      {programs && programsCount > 0 && (
        <div className={styles.paginationBottom}>
          <Pagination page={currentPage} count={programsCount || 1} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};
