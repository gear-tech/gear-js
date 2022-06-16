import { Button } from '@gear-js/ui';
import { Content } from '../../content';
import { Dashboard } from './dashboard';
import { Players } from './players';

function Pending() {
  return (
    <Content
      subheading="You can see here the lottery status. 
Click the 'Pick random winner' button to start the winner selection process.">
      <Button text="Pick random winner" color="secondary" />
      <Dashboard startTime="0" endTime="1" status="test" winner={undefined} />
      <Players list={[]} />
    </Content>
  );
}

export { Pending };
