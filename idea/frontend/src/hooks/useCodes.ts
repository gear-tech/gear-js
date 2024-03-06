import { useState } from 'react';
import { useAlert, useApi } from '@gear-js/react-hooks';

import { getCodes } from '@/api';
import { CodePaginationModel } from '@/api/code/types';
import { PaginationModel } from '@/api/types';
import { ICode } from '@/entities/code';
import { DEFAULT_LIMIT } from '@/shared/config';
import { useChain } from '@/hooks';

const useCodes = (initLoading = true) => {
  const { api, isApiReady } = useApi();
  const alert = useAlert();
  const { isDevChain } = useChain();

  const [codes, setCodes] = useState<ICode[]>([]);
  const [isLoading, setIsLoading] = useState(initLoading);
  const [totalCount, setTotalCount] = useState(0);

  const setCodesData = (data: CodePaginationModel, isReset: boolean) => {
    setTotalCount(data.count);
    // such an implementation to support StrictMode
    setCodes((prevState) => (isReset ? data.listCode : prevState.concat(data.listCode)));
  };

  const getChainCodes = (isReset: boolean) => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));

    return api.code
      .all()
      .then((ids) => ids.map((id) => ({ id, name: id })))
      .then((listCode) => ({ listCode: listCode as ICode[], count: listCode.length }))
      .then((result) => setCodesData(result, isReset));
  };

  const fetchCodes = (params?: PaginationModel, isReset = false) => {
    if (isReset) {
      setTotalCount(0);
      setCodes([]);
    }

    setIsLoading(true);

    const promise = isDevChain
      ? getChainCodes(isReset)
      : getCodes({ limit: DEFAULT_LIMIT, ...params }).then(({ result }) => setCodesData(result, isReset));

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
