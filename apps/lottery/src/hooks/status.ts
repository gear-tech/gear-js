import { STATUS } from 'consts';
import { useEffect, useState } from 'react';
import { getStatus } from 'utils';
import { useCountdown } from './countdown';

const initStatus = STATUS.AWAIT;

function useLotteryStatus(endTime: number) {
  const [status, setStatus] = useState(initStatus);
  const countdown = useCountdown(status, endTime);

  useEffect(() => {
    setStatus(getStatus(endTime));
  }, [endTime]);

  const resetStatus = () => setStatus(initStatus);

  return { countdown, status, resetStatus };
}

export { useLotteryStatus };
