import { useEffect, useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';

import { useChain, useCodes, useDataLoading } from '@/hooks';

import styles from './Codes.module.scss';
import { RequestParams } from '../model/types';
import { DEFAULT_REQUEST_PARAMS, DEFAULT_FILTER_VALUES } from '../model/consts';
import { CodesList } from './codesList';
import { SearchSettings } from './searchSettings';

const Codes = () => {
  const { account } = useAccount();
  const { isDevChain } = useChain();

  const { codes, isLoading, totalCount, fetchCodes } = useCodes();
  const { params, loadData, changeParams } = useDataLoading<RequestParams>({
    defaultParams: DEFAULT_REQUEST_PARAMS,
    fetchData: fetchCodes,
  });

  const [initialValues, setInitialValues] = useState(DEFAULT_FILTER_VALUES);

  const decodedAddress = account?.decodedAddress;

  const getUploadedByParam = (value: string) => (value === 'none' ? undefined : value);

  const handleParamsChange = ({ query, uploadedBy }: RequestParams) => {
    changeParams((prevParams) => ({
      query: query ?? prevParams.query,
      uploadedBy: uploadedBy ? getUploadedByParam(uploadedBy) : prevParams.uploadedBy,
    }));
  };

  useEffect(
    () => {
      const { uploadedBy } = params;

      if (!uploadedBy) return;

      changeParams((prevParams) => ({ ...prevParams, uploadedBy: decodedAddress }));

      // TODO: monkey patch to rerender on user logout
      // this is bad, Filters component should be refactored
      setInitialValues((prevValues) => ({ uploadedBy: decodedAddress || 'none', isRerender: !prevValues.isRerender }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [decodedAddress],
  );

  const isLoggedIn = Boolean(account);

  const { query } = params;
  const filteredCodes = isDevChain && query ? codes.filter(({ id }) => id.includes(query)) : codes;
  const count = isDevChain ? filteredCodes.length : totalCount;

  const heading = `Codes: ${count}`;

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.codesSection}>
        <h2 className={styles.heading}>{heading}</h2>
        <CodesList codes={filteredCodes} totalCount={count} isLoading={isLoading} loadMorePrograms={loadData} />
      </section>

      <SearchSettings isLoggedIn={isLoggedIn} initialValues={initialValues} onSubmit={handleParamsChange} />
    </div>
  );
};

export { Codes };
