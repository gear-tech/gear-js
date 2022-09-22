import { useState } from 'react';
import { useAlert } from '@gear-js/react-hooks';

import { getCodes } from 'api';
import { CodePaginationModel } from 'api/code/types';
import { PaginationModel } from 'api/types';
import { ICode } from 'entities/code';
import { DEFAULT_LIMIT } from 'shared/config';

const useCodes = (initLoading = true) => {
  const alert = useAlert();

  const [codes, setCodes] = useState<ICode[]>([]);
  const [isLoading, setIsLoading] = useState(initLoading);
  const [totalCount, setTotalCount] = useState(0);

  const setCodesData = (data: CodePaginationModel, isReset: boolean) => {
    setTotalCount(data.count);
    // such an implementation to support StrictMode
    setCodes((prevState) => (isReset ? data.listCode : prevState.concat(data.listCode)));
  };

  const fetchCodes = (params?: PaginationModel, isReset = false) => {
    if (isReset) {
      setTotalCount(0);
      setCodes([]);
    }

    setIsLoading(true);

    return getCodes({
      limit: DEFAULT_LIMIT,
      ...params,
    })
      .then(({ result }) => setCodesData(result, isReset))
      .catch((error) => {
        alert.error(error.message);
        return Promise.reject(error);
      })
      .finally(() => setIsLoading(false));
  };

  return { codes, isLoading, totalCount, fetchCodes };
};

export { useCodes };
