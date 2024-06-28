import { useState, useEffect } from 'react';
import { useAlert } from '@gear-js/react-hooks';

import { getMessage } from '@/api';
import { Message } from '@/features/message';

const useMessage = (id: string | undefined) => {
  const alert = useAlert();

  const [message, setMessage] = useState<Message>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);

      const withMetahash = true;

      getMessage({ id, withMetahash })
        .then(({ result }) => setMessage(result))
        .catch((error: Error) => alert.error(error.message))
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { message, isLoading };
};

export { useMessage };
