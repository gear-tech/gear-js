import { useAlert } from '@gear-js/react-hooks';
import { useState } from 'react';

import { FetchProgramsParams, ProgramPaginationModel } from '@/api/program/types';
import { IProgram } from '@/features/program';
import { DEFAULT_LIMIT } from '@/shared/config';
import { fetchPrograms } from '@/api';
import { LocalProgram, useLocalPrograms } from '@/features/local-indexer';

import { useChain } from './context';

const usePrograms = () => {
  const alert = useAlert();

  const { isDevChain } = useChain();
  const { getLocalPrograms } = useLocalPrograms();
  const getPrograms = isDevChain ? getLocalPrograms : fetchPrograms;

  const [programs, setPrograms] = useState<(IProgram | LocalProgram)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const setProgramsData = (data: ProgramPaginationModel, isReset: boolean) => {
    setTotalCount(data.count);

    setPrograms((prevState) => (isReset ? data.programs : [...prevState, ...data.programs]));
  };

  const handleGetPrograms = async (params?: FetchProgramsParams, isReset = false) => {
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
