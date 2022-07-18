import { Button } from '@gear-js/ui';
import { useChannelActions } from 'hooks';

function SubscribeAction() {
  const { subscribe } = useChannelActions();

  const handleSubscribe = () => {
    subscribe(() => console.log('Subscribed'));
  }

  return <Button text="Subsribe" onClick={handleSubscribe} />;
}

export { SubscribeAction };
