import { STATUS } from 'consts';
import { useEffect, useState } from 'react';
import { Auction } from 'types';

type Status = Auction['status'];

function useStatus(stateStatus: Status | undefined) {
  const [status, setStatus] = useState<Status>();

  useEffect(() => {
    setStatus(stateStatus);
  }, [stateStatus]);

  const resetStatus = () => setStatus(STATUS.NONE);
  const setExpiredStatus = () => setStatus(STATUS.EXPIRED);
  const setRunningStatus = () => setStatus(STATUS.IS_RUNNING);

  return { status, resetStatus, setExpiredStatus, setRunningStatus };
}

export { useStatus };
