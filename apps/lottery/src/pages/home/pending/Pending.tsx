import { Button } from '@gear-js/ui';
import { SUBHEADING } from 'consts';
import { Content } from 'components';
import { isPending } from 'utils';
import { Player } from 'types';
import { useLotteryMessage } from 'hooks';
import { Dashboard } from './dashboard';
import { Players } from './players';

type Props = {
  startTime: string;
  endTime: string;
  status: string;
  countdown: string;
  players: Player[];
};

function Pending({ startTime, endTime, status, countdown, players }: Props) {
  const sendMessage = useLotteryMessage();
  const pickWinner = () => sendMessage({ PickWinner: null });

  return (
    <Content subheading={SUBHEADING.PENDING}>
      <Button text="Pick random winner" color="secondary" disabled={isPending(status)} onClick={pickWinner} />
      <Dashboard startTime={startTime} endTime={endTime} status={status} winner={undefined} countdown={countdown} />
      <Players list={players} />
    </Content>
  );
}

export { Pending };
