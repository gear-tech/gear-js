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
  const setRunningStatus = () => setStatus('IsRunning');

  return { status, resetStatus, setExpiredStatus, setRunningStatus };
}

export { useStatus };
