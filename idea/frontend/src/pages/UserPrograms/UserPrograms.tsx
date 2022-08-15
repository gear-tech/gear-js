import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from '@gear-js/react-hooks';

import { useChangeEffect } from 'hooks';
import { ProgramModel } from 'types/program';
import { getUserPrograms } from 'services';
import { INITIAL_LIMIT_BY_PAGE, URL_PARAMS } from 'consts';
import { layoutStyles } from 'layout/MainPageLayout';
import { Pagination } from 'components/Pagination/Pagination';
import { SearchForm } from 'components/blocks/SearchForm/SearchForm';
import { ProgramsList } from 'components/blocks/ProgramsList';

const UserPrograms = () => {
  const { account } = useAccount();

  const [searchParams, setSearchParams] = useSearchParams();

  const [programs, setPrograms] = useState<ProgramModel[]>();
  const [programsCount, setProgramsCount] = useState(0);

  const page = Number(searchParams.get(URL_PARAMS.PAGE) ?? 1);
  const query = searchParams.get(URL_PARAMS.QUERY) ?? '';
  const decodedAddress = account?.decodedAddress;

  useEffect(() => {
    if (decodedAddress) {
      const params = {
        query,
        owner: decodedAddress,
        limit: INITIAL_LIMIT_BY_PAGE,
        offset: (page - 1) * INITIAL_LIMIT_BY_PAGE,
      };

      getUserPrograms(params).then(({ result }) => {
        setPrograms(result.programs);
        setProgramsCount(result.count);
      });
    }
  }, [page, query, decodedAddress]);

  useChangeEffect(() => {
    searchParams.set(URL_PARAMS.PAGE, String(1));
    searchParams.set(URL_PARAMS.QUERY, '');
    setSearchParams(searchParams);
    setPrograms([]);
    setProgramsCount(0);
  }, [decodedAddress]);

  const isLoading = !programs && Boolean(account);

  return (
    <div>
      <div className={layoutStyles.topPagination}>
        <span className={layoutStyles.caption}>Total results: {programsCount}</span>
        <Pagination page={page} pagesAmount={programsCount || 1} />
      </div>
      <SearchForm placeholder="Find program" />
      <ProgramsList
        programs={programs}
        address={account?.decodedAddress}
        isLoading={isLoading}
        className={layoutStyles.tableBody}
      />
      {programsCount > 0 && (
        <div className={layoutStyles.bottomPagination}>
          <Pagination page={page} pagesAmount={programsCount} />
        </div>
      )}
    </div>
  );
};

export { UserPrograms };
