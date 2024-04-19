import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAccount } from '@gear-js/react-hooks';

import { OwnerFilter } from '@/api/consts';
import { usePrograms, useDataLoading } from '@/hooks';
import { ProgramStatus, ProgramsSearch, RequestParams } from '@/features/program';

import { DEFAULT_REQUEST_PARAMS, DEFAULT_FILTER_VALUES } from '../../model/consts';
import { ProgramsList } from '../programsList';

import styles from './ProgramsPage.module.scss';

const ProgramsPage = () => {
  const location = useLocation();

  const { account } = useAccount();

  const { programs, isLoading, totalCount, fetchPrograms } = usePrograms();
  const { params, loadData, changeParams } = useDataLoading<RequestParams>({
    defaultParams: location.state ?? DEFAULT_REQUEST_PARAMS,
    fetchData: fetchPrograms,
  });

  const [initialValues, setInitialValues] = useState(DEFAULT_FILTER_VALUES);

  const decodedAddress = account?.decodedAddress;

  const getOwnerParam = (owner: string) => (owner === OwnerFilter.All ? undefined : decodedAddress);
  const getStatusParam = (status: ProgramStatus[] | undefined) => (status && status.length > 0 ? status : undefined);

  const handleParamsChange = ({ query, owner, status }: RequestParams) =>
    changeParams((prevParams) => ({
      query: query ?? prevParams.query,
      owner: owner ? getOwnerParam(owner) : prevParams.owner,
      status: status ? getStatusParam(status) : prevParams.status,
    }));

  useEffect(
    () => {
      const { owner, status = [] } = params;

      if (!owner) return;

      changeParams((prevParams) => ({ ...prevParams, owner: decodedAddress }));

      if (!decodedAddress) setInitialValues({ owner: OwnerFilter.All, status });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [decodedAddress],
  );

  const isLoggedIn = Boolean(account);
  const heading = `Programs: ${totalCount}`;

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.programsSection}>
        <h2 className={styles.heading}>{heading}</h2>

        <ProgramsList
          programs={programs}
          totalCount={totalCount}
          isLoading={isLoading}
          loadMorePrograms={loadData}
          main
        />
      </section>

      <ProgramsSearch isLoggedIn={isLoggedIn} initialValues={initialValues} onSubmit={handleParamsChange} />
    </div>
  );
};

export { ProgramsPage };
