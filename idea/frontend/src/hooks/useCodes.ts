import { useState } from 'react';
import { useAlert, useApi } from '@gear-js/react-hooks';

import { PaginationModel, PaginationResponse } from '@/api/types';
import { Code } from '@/features/code';
import { useChain } from '@/hooks';

const useCodes = (initLoading = true) => {
  const { api, isApiReady } = useApi();
  const alert = useAlert();
  const { isDevChain } = useChain();

  const [codes, setCodes] = useState<Code[]>([]);
  const [isLoading, setIsLoading] = useState(initLoading);
  const [totalCount, setTotalCount] = useState(0);

  const setCodesData = (data: PaginationResponse<Code>, isReset: boolean) => {
    setTotalCount(data.count);
    // such an implementation to support StrictMode
    setCodes((prevState) => (isReset ? data.result : prevState.concat(data.result)));
  };

  const getChainCodes = (isReset: boolean) => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));

    return api.code
      .all()
      .then((ids) => ids.map((id) => ({ id, name: id })))
      .then((result) => ({ result: result as Code[], count: result.length }))
      .then((result) => setCodesData(result, isReset));
  };

  const fetchCodes = (params?: PaginationModel, isReset = false) => {
    if (isReset) {
      setTotalCount(0);
      setCodes([]);
    }

    setIsLoading(true);

    const promise = getChainCodes(isReset);

    return promise
      .catch((error: Error) => {
        alert.error(error.message);
        return Promise.reject(error);
      })
      .finally(() => setIsLoading(false));
  };

  return { codes, isLoading, totalCount, fetchCodes };
};

export { useCodes };
