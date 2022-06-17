import { Button } from '@gear-js/ui';
import { SUBHEADING } from 'consts';
import { usePlayers } from 'hooks/api';
import { Content } from '../../content';
import { Dashboard } from './dashboard';
import { Players } from './players';

type Props = {
  startTime: string;
  endTime: string;
};

function Pending({ startTime, endTime }: Props) {
  const { players } = usePlayers();

  return (
    <Content subheading={SUBHEADING.PENDING}>
      <Button text="Pick random winner" color="secondary" />
      <Dashboard startTime={startTime} endTime={endTime} status="test" winner={undefined} />
      <Players list={players} />
    </Content>
  );
}

export { Pending };
