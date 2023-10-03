import { useState } from 'react';
import { useAlert } from '@gear-js/react-hooks';

import { FetchProgramsParams, ProgramPaginationModel } from 'api/program/types';
import { IProgram } from 'features/program';
import { DEFAULT_LIMIT } from 'shared/config';
import { fetchPrograms } from 'api';
import { LocalProgram, useLocalPrograms } from 'features/local-indexer';

import { useChain } from './context';

const usePrograms = (initLoading = true) => {
  const alert = useAlert();

  const { isDevChain } = useChain();
  const { getLocalPrograms } = useLocalPrograms();
  const getPrograms = isDevChain ? getLocalPrograms : fetchPrograms;

  const [programs, setPrograms] = useState<(IProgram | LocalProgram)[]>([]);
  const [isLoading, setIsLoading] = useState(initLoading);
  const [totalCount, setTotalCount] = useState(0);

  const setProgramsData = (data: ProgramPaginationModel, isReset: boolean) => {
    setTotalCount(data.count);

    // such implementation to support StrictMode
    setPrograms((prevState) => (isReset ? data.programs : prevState.concat(data.programs)));
  };

  const handleGetPrograms = (params?: FetchProgramsParams, isReset = false) => {
    if (isReset) {
      setTotalCount(0);
      setPrograms([]);
    }

    setIsLoading(true);

    return getPrograms({ limit: DEFAULT_LIMIT, ...params })
      .then(({ result }) => setProgramsData(result, isReset))
      .catch((error: Error) => {
        alert.error(error.message);
        return Promise.reject(error);
      })
      .finally(() => setIsLoading(false));
  };

  return { programs, isLoading, totalCount, fetchPrograms: handleGetPrograms };
};

export { usePrograms };
