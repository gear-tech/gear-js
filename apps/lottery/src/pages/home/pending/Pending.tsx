import { Button } from '@gear-js/ui';
import { Hex } from '@gear-js/api';
import { Content } from 'components';
import { isPending } from 'utils';
import { Player } from 'types';
import { useLotteryMessage } from 'hooks';
import { useAccount } from '@gear-js/react-hooks';
import { Dashboard } from './dashboard';
import { Players } from './players';
import { PlayerStatus } from './player-status';

type Props = {
  isOwner: boolean;
  dashboard: { startTime: string; endTime: string; status: string; winner: Hex };
  countdown: string;
  players: Player[];
};

const PENDING_SUBHEADING = 'You can see here the lottery status.';

function Pending({ isOwner, dashboard, countdown, players }: Props) {
  const { startTime, endTime, status, winner } = dashboard;

  const { account } = useAccount();

  const sendMessage = useLotteryMessage();
  const pickWinner = () => sendMessage({ PickWinner: null });

  const subheading = winner ? `Uhhu! ${winner} is the winner!` : PENDING_SUBHEADING;

  const isPlayerStatus = !isPending(status) && !isOwner;
  const isWinner = winner === account?.address;

  return (
    <Content subheading={subheading}>
      {isOwner && (
        <Button text="Pick random winner" color="secondary" disabled={isPending(status)} onClick={pickWinner} />
      )}
      <Dashboard startTime={startTime} endTime={endTime} status={status} winner={winner} countdown={countdown} />
      {isPlayerStatus && <PlayerStatus isWinner={isWinner} />}
      <Players list={players} />
    </Content>
  );
}

export { Pending };
