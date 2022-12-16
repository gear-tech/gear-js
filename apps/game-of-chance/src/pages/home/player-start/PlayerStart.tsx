import { Button } from '@gear-js/ui';
import { Content } from 'components';
import { useLotteryMessage } from 'hooks';
import { getNumber } from 'utils';

type Props = {
  cost: string;
  isToken: boolean;
};

function PlayerStart({ cost, isToken }: Props) {
  const sendMessage = useLotteryMessage();

  const subheading = `Cost of participation is ${cost}. This amount will be withdrawn from your balance. Click "Enter" if you want to proceed.`;

  const enter = () => {
    const costNumber = getNumber(cost);
    sendMessage({ Enter: costNumber }, isToken ? undefined : { value: costNumber });
  };

  return (
    <Content subheading={subheading}>
      <Button text="Enter" onClick={enter} />
    </Content>
  );
}

export { PlayerStart };
