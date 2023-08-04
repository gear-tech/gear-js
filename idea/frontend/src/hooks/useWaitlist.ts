import { useState } from 'react';
import { WaitlistItem } from '@gear-js/api';
import { useApi, useAlert } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';

const useWaitlist = () => {
  const alert = useAlert();
  const { api } = useApi();

  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWaitlist = (programId: HexString) =>
    api.waitlist
      .read(programId)
      .then(setWaitlist)
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsLoading(false));

  return { waitlist, isLoading, fetchWaitlist };
};

export { useWaitlist };
