import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from '@gear-js/react-hooks';

import { getPrograms } from 'services';
import { ProgramModel } from 'types/program';
import { INITIAL_LIMIT_BY_PAGE, URL_PARAMS } from 'consts';
import { layoutStyles } from 'layout/MainPageLayout';
import { Pagination } from 'components/Pagination/Pagination';
import { SearchForm } from 'components/blocks/SearchForm/SearchForm';
import { ProgramsList } from 'components/blocks/ProgramsList';

const AllPrograms = () => {
  const { account } = useAccount();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get(URL_PARAMS.PAGE) ?? 1);
  const query = searchParams.get(URL_PARAMS.QUERY) ?? '';

  const [programs, setPrograms] = useState<ProgramModel[]>();
  const [programsCount, setProgramsCount] = useState(0);

  useEffect(() => {
    const programParams = { limit: INITIAL_LIMIT_BY_PAGE, offset: (page - 1) * INITIAL_LIMIT_BY_PAGE, query };

    getPrograms(programParams).then(({ result }) => {
      setPrograms(result.programs);
      setProgramsCount(result.count);
    });
  }, [page, query]);

  return (
    <div>
      <div className={layoutStyles.topPagination}>
        <span className={layoutStyles.caption}>Total results: {programsCount}</span>
        <Pagination page={page} pagesAmount={programsCount || 1} />
      </div>
      <SearchForm placeholder="Find program" />
      <ProgramsList
        programs={programs}
        address={account?.address}
        isLoading={!programs}
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

export { AllPrograms };
