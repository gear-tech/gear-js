import { Button, buttonStyles } from '@gear-js/ui';
import { Params } from 'types';
import { useParams } from 'react-router-dom';
import { useChannelActions, useSubscriptions } from 'hooks';

function SubscribeAction() {
  const { subscriptions, readSubscriptions } = useSubscriptions();
  const { id } = useParams() as Params;
  const { subscribe, unsubscribe } = useChannelActions();

  const isSubsribed = readSubscriptions && subscriptions?.find((el) => el === id);

  return isSubsribed ? (
    <Button text="Unsubscribe" onClick={() => unsubscribe()} className={buttonStyles.secondary} />
  ) : (
    <Button text="Subscribe" onClick={() => subscribe()} />
  );
}

export { SubscribeAction };
