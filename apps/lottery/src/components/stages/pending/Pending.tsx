import { Button } from '@gear-js/ui';
import { SUBHEADING } from 'consts';
import { Content } from '../../content';
import { Dashboard } from './dashboard';
import { Players } from './players';

function Pending() {
  return (
    <Content subheading={SUBHEADING.PENDING}>
      <Button text="Pick random winner" color="secondary" />
      <Dashboard startTime="0" endTime="1" status="test" winner={undefined} />
      <Players list={[]} />
    </Content>
  );
}

export { Pending };
