import { useState, useEffect } from 'react';
import { useAlert } from '@gear-js/react-hooks';

import { getMessage } from '@/api';
import { IMessage } from '@/entities/message';

const useMessage = (id: string | undefined, isInitLoading = false) => {
  const alert = useAlert();

  const [message, setMessage] = useState<IMessage>();
  const [isLoading, setIsLoading] = useState(isInitLoading);

  useEffect(() => {
    if (id) {
      setIsLoading(true);

      getMessage(id)
        .then(({ result }) => setMessage(result))
        .catch((error: Error) => alert.error(error.message))
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { message, isLoading };
};

export { useMessage };
