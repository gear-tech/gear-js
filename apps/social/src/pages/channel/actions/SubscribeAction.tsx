import { Button } from '@gear-js/ui';
import { useSubscribreActions } from 'hooks';

function SubscribeAction() {
  const { subscribe } = useSubscribreActions();

  const handleSubscribe = () => {
    subscribe(() => console.log('Subscribed'));
  }

  return <Button text="Subsribe" onClick={handleSubscribe} />;
}

export { SubscribeAction };
