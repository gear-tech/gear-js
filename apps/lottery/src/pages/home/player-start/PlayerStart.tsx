import { Button } from '@gear-js/ui';
import { Content } from 'components';
import { useLotteryMessage } from 'hooks';
import { getNumber } from 'utils';

type Props = {
  cost: string;
};

function PlayerStart({ cost }: Props) {
  const sendMessage = useLotteryMessage();
  const enter = () => sendMessage({ Enter: getNumber(cost) });

  const subheading = `Cost of participation is ${cost}. This amount will be withdrawn from your balance. Click "Enter" if you want to proceed.`;

  return (
    <Content subheading={subheading}>
      <Button text="Enter" onClick={enter} />
    </Content>
  );
}

export { PlayerStart };
