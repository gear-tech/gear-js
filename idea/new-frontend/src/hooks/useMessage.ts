import { useState, useEffect } from 'react';
import { useAlert } from '@gear-js/react-hooks';

import { getMessage } from 'api';
import { IMessage } from 'entities/message';

const useMessage = (id?: string, initLoading = false) => {
  const alert = useAlert();

  const [message, setMessage] = useState<IMessage>();
  const [isLoading, setIsLoading] = useState(initLoading);

  useEffect(() => {
    if (id) {
      setIsLoading(true);

      getMessage(id)
        .then(({ result }) => setMessage(result))
        .catch((error) => alert.error(error.message))
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { message, isLoading };
};

export { useMessage };
