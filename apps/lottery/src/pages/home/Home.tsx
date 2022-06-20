import { useAccount } from '@gear-js/react-hooks';
import { Loader } from 'components';
import { useLottery } from 'hooks';
import { Start } from './start';
import { Pending } from './pending';

function Home() {
  const { account } = useAccount();

  const { lottery, isLotteryRead } = useLottery();
  const { lotteryOwner, lotteryStartTime, lotteryDuration } = lottery || {};

  const isLotteryStarted = lottery?.lotteryStarted;
  const isOwner = account?.decodedAddress === lotteryOwner;

  const getNumber = (value: string) => +value.replaceAll(',', '');
  const getDate = (value: number) => new Date(value).toLocaleString();

  const startTime = getNumber(lotteryStartTime || '');
  const duration = getNumber(lotteryDuration || '');
  const endTime = startTime + duration;

  return isLotteryRead ? (
    <>
      {!isLotteryStarted && <Start />}
      {isLotteryStarted && <Pending startTime={getDate(startTime)} endTime={getDate(endTime)} />}
    </>
  ) : (
    <Loader />
  );
}

export { Home };
