import { STATUS } from 'consts';
import { useEffect, useState } from 'react';
import { getCountdown } from 'utils';

function useCountdown(status: string, endTime: number) {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    let intervalId: NodeJS.Timer | undefined;

    if (status === STATUS.PENDING) {
      intervalId = setInterval(() => setCountdown(getCountdown(endTime)), 1000);
    } else {
      setCountdown('');
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return countdown;
}

export { useCountdown };
