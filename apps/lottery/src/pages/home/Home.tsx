import { useAccount } from '@gear-js/react-hooks';
import { Content, Loader } from 'components';
import { useLottery, useLotteryStatus } from 'hooks';
import { getDate, getUnix } from 'utils';
import { SUBHEADING } from 'consts';
import { Hex } from '@gear-js/api';
import { Start } from './start';
import { Pending } from './pending';

function Home() {
  const { account } = useAccount();

  const { lottery, isLotteryRead } = useLottery();
  const { lotteryOwner, lotteryStartTime, lotteryDuration } = lottery || {};

  const isLotteryStarted = lottery?.lotteryStarted;
  const players = lottery ? Object.values(lottery.players) : [];
  const isOwner = account?.decodedAddress === lotteryOwner;

  const startTime = getUnix(lotteryStartTime || '');
  const duration = getUnix(lotteryDuration || '');
  const endTime = startTime + duration;

  const { status, countdown } = useLotteryStatus(endTime);

  return isLotteryRead ? (
    <>
      {!isLotteryStarted && (isOwner ? <Start /> : <Content subheading={SUBHEADING.START.PLAYER} />)}
      {isLotteryStarted && (
        <Pending
          isOwner={isOwner}
          startTime={getDate(startTime)}
          endTime={getDate(endTime)}
          status={status}
          winner={'' as Hex}
          countdown={countdown}
          players={players}
        />
      )}
    </>
  ) : (
    <Loader />
  );
}

export { Home };
