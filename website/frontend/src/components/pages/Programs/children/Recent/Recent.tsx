import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import styles from './Recent.module.scss';
import { UserProgram } from '../UserProgram/UserProgram';
import { ProgramsLegend } from '../ProgramsLegend/ProgramsLegend';

import { useAccount } from 'hooks';
import { ProgramModel } from 'types/program';
import { getUserPrograms } from 'services';
import { INITIAL_LIMIT_BY_PAGE, URL_PARAMS } from 'consts';
import { Pagination } from 'components/Pagination/Pagination';
import { SearchForm } from 'components/blocks/SearchForm/SearchForm';

const Recent = () => {
  const { account } = useAccount();
  const isAccountLoaded = useRef(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get(URL_PARAMS.PAGE) ?? 1);
  const query = searchParams.get(URL_PARAMS.QUERY) ?? '';

  const [programs, setPrograms] = useState<ProgramModel[]>([]);
  const [programsCount, setProgramsCount] = useState(0);

  useEffect(() => {
    if (isAccountLoaded.current) {
      searchParams.set(URL_PARAMS.PAGE, String(1));
      searchParams.set(URL_PARAMS.QUERY, '');
      setSearchParams(searchParams);
      setPrograms([]);
    }

    return () => {
      isAccountLoaded.current = Boolean(account);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    if (account) {
      const params = {
        query,
        owner: account.decodedAddress,
        limit: INITIAL_LIMIT_BY_PAGE,
        offset: (page - 1) * INITIAL_LIMIT_BY_PAGE,
      };

      getUserPrograms(params).then(({ result }) => {
        setPrograms(result.programs);
        setProgramsCount(result.count);
      });
    }
  }, [page, query, account]);

  return (
    <div>
      <div className={styles.paginationWrapper}>
        <span>Total results: {programsCount}</span>
        <Pagination page={page} pagesAmount={programsCount || 1} />
      </div>
      <SearchForm placeholder="Find program" />
      <ProgramsLegend />
      <div>
        {programs.map((program) => (
          <UserProgram key={program.id} program={program} />
        ))}
      </div>
      {programsCount > 0 && (
        <div className={styles.paginationBottom}>
          <Pagination page={page} pagesAmount={programsCount} />
        </div>
      )}
    </div>
  );
};

export { Recent };
