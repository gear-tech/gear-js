import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from '@gear-js/react-hooks';

import { useChangeEffect } from 'hooks';
import { getCodes } from 'services';
import { INITIAL_LIMIT_BY_PAGE, URL_PARAMS } from 'consts';
import { CodeModel } from 'types/code';
import { layoutStyles } from 'layout/MainPageLayout';
import { Pagination } from 'components/Pagination/Pagination';
import { SearchForm } from 'components/blocks/SearchForm/SearchForm';
import { CodesList } from 'components/blocks/CodesList';

const Codes = () => {
  const { account } = useAccount();

  const [searchParams, setSearchParams] = useSearchParams();

  const [codes, setCodes] = useState<CodeModel[]>();
  const [codesCount, setCodesCount] = useState(0);

  const page = Number(searchParams.get(URL_PARAMS.PAGE) ?? 1);
  const query = searchParams.get(URL_PARAMS.QUERY) ?? '';
  const decodedAddress = account?.decodedAddress;

  useEffect(() => {
    if (decodedAddress) {
      const params = {
        query,
        limit: INITIAL_LIMIT_BY_PAGE,
        offset: (page - 1) * INITIAL_LIMIT_BY_PAGE,
      };

      getCodes(params).then(({ result }) => {
        setCodes(result.listCode);
        setCodesCount(result.count);
      });
    }
  }, [page, query, decodedAddress]);

  useChangeEffect(() => {
    searchParams.set(URL_PARAMS.PAGE, String(1));
    searchParams.set(URL_PARAMS.QUERY, '');
    setSearchParams(searchParams);
    setCodes([]);
    setCodesCount(0);
  }, [decodedAddress]);

  const isLoading = !codes && Boolean(account);

  return (
    <div>
      <div className={layoutStyles.topPagination}>
        <span className={layoutStyles.caption}>Total results: {codesCount}</span>
        <Pagination page={page} pagesAmount={codesCount || 1} />
      </div>
      <SearchForm placeholder="Find code" />
      <CodesList codes={codes} isLoading={isLoading} className={layoutStyles.tableBody} />
      {codesCount > 0 && (
        <div className={layoutStyles.bottomPagination}>
          <Pagination page={page} pagesAmount={codesCount} />
        </div>
      )}
    </div>
  );
};

export { Codes };
