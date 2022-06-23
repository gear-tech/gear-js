import { getStatus } from 'utils';
import { useCountdown } from './countdown';

function useLotteryStatus(endTime: number) {
  const status = getStatus(endTime);
  const countdown = useCountdown(status, endTime);

  return { countdown, status };
}

export { useLotteryStatus };
