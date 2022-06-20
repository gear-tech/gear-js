import { Button } from '@gear-js/ui';
import { SUBHEADING } from 'consts';
import { usePlayers } from 'hooks/api';
import { Content } from 'components';
import { isPending } from 'utils';
import { Dashboard } from './dashboard';
import { Players } from './players';

type Props = {
  startTime: string;
  endTime: string;
  status: string;
};

function Pending({ startTime, endTime, status }: Props) {
  const { players } = usePlayers();

  return (
    <Content subheading={SUBHEADING.PENDING}>
      <Button text="Pick random winner" color="secondary" disabled={isPending(status)} />
      <Dashboard startTime={startTime} endTime={endTime} status={status} winner={undefined} />
      <Players list={players} />
    </Content>
  );
}

export { Pending };
