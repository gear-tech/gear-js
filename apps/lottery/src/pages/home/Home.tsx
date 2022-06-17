import { useAccount } from '@gear-js/react-hooks';
import { Loader, Pending, Start } from 'components';
import { useLottery } from 'hooks';

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
