import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GearKeyring } from '@gear-js/api';

import styles from './All.module.scss';
import { UserProgram } from '../UserProgram/UserProgram';
import { ProgramsLegend } from '../ProgramsLegend/ProgramsLegend';

import { useAccount } from 'hooks';
import { getPrograms } from 'services';
import { ProgramModel } from 'types/program';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import { Pagination } from 'components/Pagination/Pagination';
import { SearchForm } from 'components/blocks/SearchForm/SearchForm';

export const All = () => {
  const location = useLocation();
  const { account } = useAccount();

  const searchParams = new URLSearchParams(location.search);
  const pageFromUrl = searchParams.has('page') ? Number(searchParams.get('page')) : 1;

  const [term, setTerm] = useState('');
  const [programs, setPrograms] = useState<ProgramModel[]>([]);

  const [page, setPage] = useState(pageFromUrl);
  const [programsCount, setProgramsCount] = useState(0);

  const accountDecodedAddress = GearKeyring.decodeAddress(account?.address || '');

  const handleSearch = (currentTerm: string) => {
    setTerm(currentTerm);
    setPage(1);
  };

  const handleRemoveQuery = () => {
    setTerm('');
    setPage(1);
  };

  useEffect(() => {
    const programParams = { limit: INITIAL_LIMIT_BY_PAGE, offset: (page - 1) * INITIAL_LIMIT_BY_PAGE, term };

    getPrograms(programParams).then(({ result }) => {
      setPrograms(result.programs);
      setProgramsCount(result.count);
    });
  }, [page, term]);

  return (
    <div className="all-programs">
      <div className={styles.paginationWrapper}>
        <span>Total results: {programsCount || 0}</span>
        <Pagination page={page} count={programsCount || 1} onPageChange={setPage} />
      </div>
      <div>
        <SearchForm placeholder="Find program" handleSearch={handleSearch} handleRemoveQuery={handleRemoveQuery} />
        <br />
      </div>
      <ProgramsLegend />
      <div className={styles.allProgramsList}>
        {programs.map((program: ProgramModel) => (
          <UserProgram key={program.id} program={program} isMetaLinkActive={accountDecodedAddress === program.owner} />
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
