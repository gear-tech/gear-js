import { useState } from 'react';
import { WaitlistItem } from '@gear-js/api';
import { useApi, useAlert } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';

const useWaitlist = () => {
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWaitlist = async (programId: HexString) => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));

    return api.waitlist
      .read(programId)
      .then((result) => setWaitlist(result))
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsLoading(false));
  };

  return { waitlist, isLoading, fetchWaitlist };
};

export { useWaitlist };
