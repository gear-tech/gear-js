import { useState } from 'react';
import { Hex, WaitlistItem } from '@gear-js/api';
import { useApi, useAlert } from '@gear-js/react-hooks';

const useWaitlist = () => {
  const alert = useAlert();
  const { api } = useApi();

  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWaitlist = (programId: Hex) =>
    api.waitlist
      .read(programId)
      .then(setWaitlist)
      .catch((error: Error) => alert.error(error.message))
      .finally(() => setIsLoading(false));

  return { waitlist, totalCount: waitlist.length, isLoading, fetchWaitlist };
};

export { useWaitlist };
