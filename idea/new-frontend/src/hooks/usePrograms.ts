import { useState } from 'react';
import { useAlert } from '@gear-js/react-hooks';

import { getPrograms } from 'api';
import { FetchProgramsParams, ProgramPaginationModel } from 'api/program/types';
import { IProgram } from 'entities/program';
import { DEFAULT_LIMIT } from 'shared/config';

const usePrograms = (initLoading = true) => {
  const alert = useAlert();

  const [count, setCount] = useState(0);
  const [programs, setPrograms] = useState<IProgram[]>([]);
  const [isLoading, setIsLoading] = useState(initLoading);

  const setProgramsData = (data: ProgramPaginationModel, isReset: boolean) => {
    setCount(data.count);
    // such an implementation to support StrictMode
    setPrograms((prevState) => (isReset ? data.programs : prevState.concat(data.programs)));
  };

  const fetchPrograms = (params?: FetchProgramsParams, isReset = false) => {
    if (isReset) {
      setCount(0);
      setPrograms([]);
    }

    setIsLoading(true);

    return getPrograms({
      limit: DEFAULT_LIMIT,
      ...params,
    })
      .then(({ result }) => setProgramsData(result, isReset))
      .catch((error) => {
        alert.error(error.message);
        return Promise.reject(error);
      })
      .finally(() => setIsLoading(false));
  };

  return { count, programs, isLoading, fetchPrograms };
};

export { usePrograms };
