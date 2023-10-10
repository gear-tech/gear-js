import { useState } from 'react';
import { useAlert } from '@gear-js/react-hooks';

import { getMessages } from '@/api';
import { MessagePaginationModel } from '@/api/message/types';
import { PaginationModel } from '@/api/types';
import { IMessage } from '@/entities/message';
import { DEFAULT_LIMIT } from '@/shared/config';

import { useChain } from './context';

const useMessages = (initLoading = true) => {
  const alert = useAlert();
  const { isDevChain } = useChain();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(initLoading);
  const [totalCount, setTotalCount] = useState(0);

  const setMessagesData = (data: MessagePaginationModel, isReset: boolean) => {
    setTotalCount(data.count);
    // such an implementation to support StrictMode
    setMessages((prevState) => (isReset ? data.messages : prevState.concat(data.messages)));
  };

  const fetchMessages = (params?: PaginationModel, isReset = false) => {
    if (isReset) {
      setTotalCount(0);
      setMessages([]);
    }

    setIsLoading(true);

    return isDevChain
      ? Promise.resolve().then(() => setIsLoading(false)) // we don't store local node messages
      : getMessages({ limit: DEFAULT_LIMIT, ...params })
          .then(({ result }) => setMessagesData(result, isReset))
          .catch((error) => {
            alert.error(error.message);
            return Promise.reject(error);
          })
          .finally(() => setIsLoading(false));
  };

  return { messages, isLoading, totalCount, fetchMessages };
};

export { useMessages };
