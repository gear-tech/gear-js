import { Hex } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { Content, Loader } from 'components';
import { useLottery, useLotteryStatus } from 'hooks';
import { getDate, getNumber, isPending } from 'utils';
import { OwnerStart } from './owner-start';
import { PlayerStart } from './player-start';
import { Pending } from './pending';

const WAIT_SUBHEADING = 'Waiting for owner to start the lottery.';
const FINISH_SUBHEADING = 'Lottery is finished. Waiting for owner to pick the winner.';

function Home() {
  const { account } = useAccount();

  const { lottery, isLotteryRead } = useLottery();
  const { lotteryOwner, lotteryStartTime, lotteryDuration } = lottery || {};

  const isLotteryStarted = lottery?.lotteryStarted;
  const cost = lottery?.participationCost || '';
  const players = lottery ? Object.values(lottery.players) : [];
  const isOwner = account?.decodedAddress === lotteryOwner;
  const isPlayer = players.some(({ playerId }) => playerId === account?.address);

  const startTime = getNumber(lotteryStartTime || '');
  const duration = getNumber(lotteryDuration || '');
  const endTime = startTime + duration;

  const { status, countdown } = useLotteryStatus(endTime);
  const dashboard = { startTime: getDate(startTime), endTime: getDate(endTime), status, winner: '' as Hex };

  return isLotteryRead ? (
    <>
      {!isLotteryStarted && (isOwner ? <OwnerStart /> : <Content subheading={WAIT_SUBHEADING} />)}
      {isLotteryStarted &&
        (isPlayer || isOwner ? (
          <Pending isOwner={isOwner} dashboard={dashboard} countdown={countdown} players={players} />
        ) : (
          <>
            {isPending(status) && <PlayerStart cost={cost} />}
            {!isPending(status) && <Content subheading={FINISH_SUBHEADING} />}
          </>
        ))}
    </>
  ) : (
    <Loader />
  );
}

export { Home };
