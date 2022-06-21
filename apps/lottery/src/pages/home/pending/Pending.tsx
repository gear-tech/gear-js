import { Button } from '@gear-js/ui';
import { Hex } from '@gear-js/api';
import { SUBHEADING } from 'consts';
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
  startTime: string;
  endTime: string;
  status: string;
  winner: Hex;
  countdown: string;
  players: Player[];
};

function Pending({ isOwner, startTime, endTime, status, winner, countdown, players }: Props) {
  const { account } = useAccount();

  const sendMessage = useLotteryMessage();
  const pickWinner = () => sendMessage({ PickWinner: null });

  const subheading = winner ? `Uhhu! ${winner} is the winner!` : SUBHEADING.PENDING;

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
