import React, { useEffect, useState, VFC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProgramModel } from 'types/program';

import { INITIAL_LIMIT_BY_PAGE, LOCAL_STORAGE } from 'consts';

import { ProgramsLegend } from 'components/pages/Programs/children/ProgramsLegend/ProgramsLegend';
import { Meta } from 'components/Meta/Meta';
import { Pagination } from 'components/Pagination/Pagination';

import styles from './Recent.module.scss';
import { UserProgram } from '../UserProgram/UserProgram';

import { SearchForm } from 'components/blocks/SearchForm/SearchForm';
import { URL_PARAMS } from 'consts';
import { getUserPrograms } from 'services';

type ProgramMessageType = {
  programName: string;
  programId: string;
};

export const Recent: VFC = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.has(URL_PARAMS.PAGE) ? Number(searchParams.get(URL_PARAMS.PAGE)) : 1;
  const query = searchParams.has(URL_PARAMS.QUERY) ? String(searchParams.get(URL_PARAMS.QUERY)) : '';

  const [programs, setPrograms] = useState<ProgramModel[]>([]);
  const [programsCount, setProgramsCount] = useState(0);

  const [programMeta, setProgramMeta] = useState<ProgramMessageType | null>(null);

  useEffect(() => {
    const programParams = {
      owner: localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW),
      limit: INITIAL_LIMIT_BY_PAGE,
      offset: (page - 1) * INITIAL_LIMIT_BY_PAGE,
      term: query,
    };

    getUserPrograms(programParams).then(({ result }) => {
      setPrograms(result.programs);
      setProgramsCount(result.count);
    });
  }, [page, query]);

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
  return (
    <div className={styles.blockList}>
      <div className={styles.paginationWrapper}>
        <span>Total results: {programsCount || 0}</span>
        <Pagination page={page} pagesAmount={programsCount || 1} />
      </div>
      <SearchForm placeholder="Find program" />
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
          <Pagination page={page} pagesAmount={programsCount || 1} />
        </div>
      )}
    </div>
  );
};
