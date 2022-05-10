import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Pagination } from 'components/Pagination/Pagination';
import { ProgramsLegend } from 'components/pages/Programs/children/ProgramsLegend/ProgramsLegend';
import { INITIAL_LIMIT_BY_PAGE, LOCAL_STORAGE } from 'consts';
import { ProgramModel } from 'types/program';
import { UserProgram } from '../UserProgram/UserProgram';
import { SearchForm } from 'components/blocks/SearchForm/SearchForm';
import { URL_PARAMS } from 'consts';
import { getPrograms } from 'services';
import styles from './All.module.scss';

export const All = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.has(URL_PARAMS.PAGE) ? Number(searchParams.get(URL_PARAMS.PAGE)) : 1;
  const query = searchParams.has(URL_PARAMS.QUERY) ? String(searchParams.get(URL_PARAMS.QUERY)) : '';
  const publicKeyRaw = localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW);

  const [programs, setPrograms] = useState<ProgramModel[]>([]);
  const [programsCount, setProgramsCount] = useState(0);

  useEffect(() => {
    const programParams = {
      limit: INITIAL_LIMIT_BY_PAGE,
      offset: (page - 1) * INITIAL_LIMIT_BY_PAGE,
      term: query,
    };

    getPrograms(programParams).then(({ result }) => {
      setPrograms(result.programs);
      setProgramsCount(result.count);
    });
  }, [page, query]);

  return (
    <div className="all-programs">
      <div className={styles.paginationWrapper}>
        <span>Total results: {programsCount || 0}</span>
        <Pagination page={page} pagesAmount={programsCount || 1} />
      </div>
      <SearchForm placeholder="Find program" />
      <ProgramsLegend />
      <div className={styles.allProgramsList}>
        {programs.map((program: ProgramModel) => (
          <UserProgram key={program.id} program={program} isMetaLinkActive={publicKeyRaw === program.owner} />
        ))}
      </div>
      {programsCount > 0 && (
        <div className={styles.paginationBottom}>
          <Pagination page={page} pagesAmount={programsCount || 1} />
        </div>
      )}
    </div>
  );
};
