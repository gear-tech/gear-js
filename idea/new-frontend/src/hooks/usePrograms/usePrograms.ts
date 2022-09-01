import { useState } from 'react';
import { useAlert } from '@gear-js/react-hooks';

import { getPrograms } from 'api';
import { FetchProgramsParams, ProgramPaginationModel } from 'api/program/types';
import { DEFAULT_LIMIT } from 'shared/config';

import { INIT_STATE } from './consts';

const usePrograms = (initLoading = true) => {
  const alert = useAlert();

  const [isLoading, setIsLoading] = useState(initLoading);
  const [programsData, setProgramsData] = useState<ProgramPaginationModel>(INIT_STATE);

  const fetchPrograms = (params?: FetchProgramsParams) => {
    setIsLoading(true);
    setProgramsData(INIT_STATE);

    getPrograms({
      limit: DEFAULT_LIMIT,
      ...params,
    })
      .then(({ result }) => setProgramsData(result))
      .catch((error) => alert.error(error.message))
      .finally(() => setIsLoading(false));
  };

  return { fetchPrograms, programsData, isLoading };
};

export { usePrograms };
