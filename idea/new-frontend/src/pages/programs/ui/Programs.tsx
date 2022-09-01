import { useRef, useState, useEffect, useCallback } from 'react';
import { useAccount } from '@gear-js/react-hooks';

import { usePrograms, useWindowScrollLoader } from 'hooks';
import { DEFAULT_LIMIT } from 'shared/config';

import styles from './Programs.module.scss';
import { RequestParams } from '../model/types';
import { DEFAULT_REQUEST_PARAMS } from '../model/consts';
import { ProgramsData } from './programsData';
import { SearchSettings } from './searchSettings';

const Programs = () => {
  const { account } = useAccount();
  const { count, programs, isLoading, fetchPrograms } = usePrograms();

  const offset = useRef(0);
  const [hasMore, setHasMore] = useState(false);
  const [requestParams, setRequestParams] = useState(DEFAULT_REQUEST_PARAMS);

  const loadPrograms = useCallback(
    (isReset = false) => {
      const { owner, query } = requestParams;

      if (isReset) {
        offset.current = 0;
      }

      setHasMore(false);
      fetchPrograms(
        {
          query,
          owner: owner || undefined,
          offset: offset.current,
        },
        isReset,
      ).then(() => {
        offset.current += DEFAULT_LIMIT;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [requestParams],
  );

  const handleParamsChange = useCallback(
    (params: RequestParams) =>
      setRequestParams((prevState) => ({
        ...prevState,
        ...params,
      })),
    [],
  );

  useEffect(() => {
    setHasMore(programs.length < count);
  }, [count, programs]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    loadPrograms(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPrograms]);

  useWindowScrollLoader({ hasMore, callback: loadPrograms });

  const isLoggedIn = Boolean(account);
  const decodedAddress = account?.decodedAddress;

  return (
    <div className={styles.pageWrapper}>
      <ProgramsData
        count={count}
        programs={programs}
        isLoading={!count && isLoading}
        isLoggedIn={isLoggedIn}
        onParamsChange={handleParamsChange}
      />
      <SearchSettings decodedAddress={decodedAddress} onParamsChange={handleParamsChange} />
    </div>
  );
};

export { Programs };
