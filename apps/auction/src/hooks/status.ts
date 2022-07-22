import { useEffect, useState } from 'react';
import { Auction } from 'types';

type Status = Auction['status'];

function useStatus(stateStatus: Status | undefined) {
  const [status, setStatus] = useState<Status>();

  useEffect(() => {
    setStatus(stateStatus);
  }, [stateStatus]);

  const resetStatus = () => setStatus('None');
  const setExpiredStatus = () => setStatus('Expired');

  return { status, resetStatus, setExpiredStatus };
}

export { useStatus };
