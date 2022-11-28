import { useEffect, useState } from 'react';
import { MULTIPLIER, STATUS } from 'consts';
import { getCountdown, getStatus } from 'utils';

const initStatus = STATUS.AWAIT;

function useStatus(endTime: number) {
  const [status, setStatus] = useState(initStatus);

  const updateStatus = () => setStatus(getStatus(endTime));
  const resetStatus = () => setStatus(initStatus);

  useEffect(() => {
    if (endTime) updateStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTime]);

  return { status, updateStatus, resetStatus };
}

function useCountdown(endTime: number, status: string, updateStatus: () => void) {
  const [countdown, setCountdown] = useState('');

  const handleCountdown = () => {
    setCountdown(getCountdown(endTime));
    updateStatus();
  };

  useEffect(() => {
    let intervalId: NodeJS.Timer | undefined;

    if (status === STATUS.PENDING) {
      intervalId = setInterval(handleCountdown, MULTIPLIER.MILLISECONDS);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, endTime]);

  return countdown;
}

function useLotteryStatus(endTime: number) {
  const { status, updateStatus, resetStatus } = useStatus(endTime);
  const countdown = useCountdown(endTime, status, updateStatus);

  return { countdown, status, resetStatus };
}

export { useLotteryStatus };
