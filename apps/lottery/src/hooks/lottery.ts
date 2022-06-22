import { STATUS } from 'consts';
import { useEffect, useState } from 'react';
import { isPending } from 'utils';
import { getCountdown } from 'utils/countdown';

function useLotteryStatus(endTime: number) {
  const [countdown, setCountdown] = useState('');
  const currentTime = Date.now();

  const status = currentTime > endTime ? STATUS.FINISHED : STATUS.PENDING;

  useEffect(() => {
    let intervalId: NodeJS.Timer | undefined;

    if (isPending(status)) {
      intervalId = setInterval(() => setCountdown(getCountdown(endTime)), 1000);
    } else {
      setCountdown('');
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return { countdown, status };
}

export { useLotteryStatus };
