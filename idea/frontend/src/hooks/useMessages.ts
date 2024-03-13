import { useState } from 'react';
import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';

import { getMessages } from '@/api';
import { MessagePaginationModel } from '@/api/message/types';
import { PaginationModel } from '@/api/types';
import { IMessage } from '@/entities/message';
import { DEFAULT_LIMIT } from '@/shared/config';

import { useChain } from './context';

const useMessages = (withPrograms = false) => {
  const alert = useAlert();
  const { isDevChain } = useChain();

  const [programNames, setProgramNames] = useState<Record<HexString, string>>({});
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const setMessagesData = (data: MessagePaginationModel, isReset: boolean) => {
    setTotalCount(data.count);
    setMessages((prevMessages) => (isReset ? data.messages : [...prevMessages, ...data.messages]));

    const _programNames = data.programNames || {};
    setProgramNames((prevNames) => (isReset ? _programNames : { ...prevNames, ..._programNames }));
  };

  const fetchMessages = (params?: PaginationModel, isReset = false) => {
    if (isReset) {
      setTotalCount(0);
      setMessages([]);
    }

    setIsLoading(true);

    return isDevChain
      ? Promise.resolve().then(() => setIsLoading(false)) // we don't store local node messages
      : getMessages({ limit: DEFAULT_LIMIT, withPrograms, ...params })
          .then(({ result }) => setMessagesData(result, isReset))
          .catch((error: Error) => {
            alert.error(error.message);
            return Promise.reject(error);
          })
          .finally(() => setIsLoading(false));
  };

  return { messages, isLoading, totalCount, programNames, fetchMessages };
};

export { useMessages };
