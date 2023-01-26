import { Hex } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { Content, Loader } from 'components';
import { useLotteryState, useLotteryStatus } from 'hooks';
import { getDate, getNumber, isWinner } from 'utils';
import { STATUS, SUBHEADING } from 'consts';
import { OwnerStart } from './owner-start';
import { PlayerStart } from './player-start';
import { Pending } from './pending';

function Home() {
  const { account } = useAccount();

  const { state, isStateRead } = useLotteryState();
  const { admin, started, ending, fungibleToken } = state || {};

  const cost = state?.participationCost || '';
  const prizeFund = state?.prizeFund || '';
  const players = state?.players || [];
  const winner = state && isWinner(state.winner) ? state.winner : ('' as Hex);
  const isOwner = account?.decodedAddress === admin;
  const isPlayer = players.some((playerId) => playerId === account?.decodedAddress);
  const isParticipant = isPlayer || isOwner;

  const startTime = getNumber(started || '');
  const endTime = getNumber(ending || '');

  const { status, countdown, resetStatus } = useLotteryStatus(endTime);
  const isLotteryStarted = status !== STATUS.AWAIT;
  const isLotteryActive = status === STATUS.PENDING;
  const dashboard = { startTime: getDate(startTime), endTime: getDate(endTime), status, winner, countdown };

  return isStateRead ? (
    <>
      {isLotteryStarted && isParticipant && (
        <Pending
          isOwner={isOwner}
          dashboard={dashboard}
          prizeFund={prizeFund}
          players={players}
          cost={cost}
          onResetButtonClick={resetStatus}
        />
      )}

      {!isLotteryStarted && isOwner && <OwnerStart />}
      {isLotteryActive && !isParticipant && <PlayerStart cost={cost} isToken={!!fungibleToken} />}
      {!isLotteryActive && !isParticipant && <Content subheading={SUBHEADING.AWAIT} />}
    </>
  ) : (
    <Loader />
  );
}

export { Home };
