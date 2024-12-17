import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { isCodeIdValid } from './utils';

function useDefaultCodeId() {
  const { codeId } = useParams<{ codeId: HexString }>();
  const alert = useAlert();

  const defaultCodeId = codeId && isCodeIdValid(codeId) ? codeId : undefined;

  useEffect(() => {
    if (codeId && !isCodeIdValid(codeId)) alert.error('Code hash provided in the URL is invalid');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return defaultCodeId;
}

export { useDefaultCodeId };
