import { useAccount } from '@gear-js/react-hooks';
import { Loader } from 'components';
import { useLottery } from 'hooks';
import { getDate, getUnix } from 'utils';
import { STATUS } from 'consts';
import { Start } from './start';
import { Pending } from './pending';

function Home() {
  const { account } = useAccount();

  const { lottery, isLotteryRead } = useLottery();
  const { lotteryOwner, lotteryStartTime, lotteryDuration } = lottery || {};

  const isLotteryStarted = lottery?.lotteryStarted;
  const isOwner = account?.decodedAddress === lotteryOwner;

  const startTime = getUnix(lotteryStartTime || '');
  const duration = getUnix(lotteryDuration || '');
  const endTime = startTime + duration;

  const status = Date.now() > endTime ? STATUS.FINISHED : STATUS.PENDING;

  return isLotteryRead ? (
    <>
      {!isLotteryStarted && <Start />}
      {isLotteryStarted && <Pending startTime={getDate(startTime)} endTime={getDate(endTime)} status={status} />}
    </>
  ) : (
    <Loader />
  );
}

export { Home };
