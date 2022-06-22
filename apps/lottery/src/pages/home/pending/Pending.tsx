import { Button } from '@gear-js/ui';
import { useAccount } from '@gear-js/react-hooks';
import { Content } from 'components';
import { Player, DashboardProps } from 'types';
import { useLotteryMessage } from 'hooks';
import { STATUS, SUBHEADING } from 'consts';
import { Dashboard } from './dashboard';
import { Players } from './players';
import { PlayerStatus } from './player-status';

type Props = {
  isOwner: boolean;
  dashboard: DashboardProps;
  players: Player[];
  onResetButtonClick: () => void;
};

function Pending({ isOwner, dashboard, players, onResetButtonClick }: Props) {
  const { account } = useAccount();

  const sendMessage = useLotteryMessage();
  const pickWinner = () => sendMessage({ PickWinner: null });

  const { startTime, endTime, status, winner, countdown } = dashboard;
  const subheading = winner ? `Uhhu! ${winner} is the winner!` : SUBHEADING.PENDING;
  const isLotteryActive = status === STATUS.PENDING;
  const isPlayerStatus = !isLotteryActive && !isOwner;
  const isPlayerWinner = winner === account?.address;

  return (
    <Content subheading={subheading}>
      {isOwner &&
        (winner ? (
          <Button text="Start new lottery" onClick={onResetButtonClick} />
        ) : (
          <Button text="Pick random winner" color="secondary" disabled={isLotteryActive} onClick={pickWinner} />
        ))}
      <Dashboard startTime={startTime} endTime={endTime} status={status} winner={winner} countdown={countdown} />
      {isPlayerStatus && <PlayerStatus isWinner={isPlayerWinner} />}
      <Players list={players} />
    </Content>
  );
}

export { Pending };
