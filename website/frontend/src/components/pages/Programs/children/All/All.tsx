import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Pagination } from 'components/Pagination/Pagination';
import { ProgramsLegend } from 'components/pages/Programs/children/ProgramsLegend/ProgramsLegend';
import { INITIAL_LIMIT_BY_PAGE, LOCAL_STORAGE } from 'consts';
import { ProgramModel } from 'types/program';
import { UserProgram } from '../UserProgram/UserProgram';
import styles from './All.module.scss';

import { SearchForm } from '../../../../blocks/SearchForm/SearchForm';
import { getPrograms } from 'services';

export const All = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageFromUrl = searchParams.has('page') ? Number(searchParams.get('page')) : 1;
  const publicKeyRaw = localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW);

  const [term, setTerm] = useState('');
  const [programs, setPrograms] = useState<ProgramModel[]>([]);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [programsCount, setProgramsCount] = useState(0);

  const onPageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    const programParams = { limit: INITIAL_LIMIT_BY_PAGE, offset: (currentPage - 1) * INITIAL_LIMIT_BY_PAGE, term };

    getPrograms(programParams).then(({ result }) => {
      setPrograms(result.programs);
      setProgramsCount(result.count);
    });
  }, [currentPage, term]);

  return (
    <div className="all-programs">
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
      <div className={styles.allProgramsList}>
        {programs.map((program: ProgramModel) => (
          <UserProgram key={program.id} program={program} isMetaLinkActive={publicKeyRaw === program.owner} />
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
