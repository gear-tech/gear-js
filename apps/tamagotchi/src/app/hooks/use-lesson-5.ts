import { useApi } from '@gear-js/react-hooks';
import { useEffect } from 'react';
import { UnsubscribePromise } from '@polkadot/api/types';
import { useLesson } from '../context';
import { NotificationResponseTypes } from '../types/lessons';

export const useLesson5 = () => {
  const { lesson, meta, notification, setNotification, tamagotchi } = useLesson();

  const { api } = useApi();

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (meta && lesson?.step === 5) {
      unsub = api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data }) => {
        const { message } = data;
        const { source, payload } = message;

        if (source.toHex() === lesson?.programId) {
          const decodedPayload = meta.createType(8, payload).toHuman() as NotificationResponseTypes;
          // console.log('payload: ', decodedPayload);
          const checkTypes = notification.map((el) => el[0]);

          if (tamagotchi && decodedPayload && !checkTypes.includes(decodedPayload)) {
            const getNotificationTypeAmount = (): number => {
              switch (decodedPayload) {
                case 'FeedMe':
                  return tamagotchi.fed;
                case 'PlayWithMe':
                  return tamagotchi.entertained;
                case 'WantToSleep':
                  return tamagotchi.rested;
              }
            };
            setNotification([...notification, [decodedPayload, getNotificationTypeAmount()]]);
          }
        }
      });
    }

    return () => {
      if (unsub) unsub.then((unsubCallback) => unsubCallback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta]);
};
