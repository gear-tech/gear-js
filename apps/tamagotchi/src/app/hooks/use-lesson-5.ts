import { useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';
import { UnsubscribePromise } from '@polkadot/api/types';
import { useLesson } from '../context';
import { NotificationResponseTypes, NotificationType } from '../types/lessons';
import { UserMessageSent } from '@gear-js/api';
import { getNotificationTypeValue } from '../utils';

export const useLesson5 = () => {
  const { api } = useApi();
  const [notification, setNotification] = useState<NotificationType>({});
  const [activeNotification, setActiveNotification] = useState<NotificationResponseTypes>();
  const { lesson, meta, tamagotchi } = useLesson();

  useEffect(() => {
    if (tamagotchi) {
      const { fed, rested, entertained } = tamagotchi;
      if ([fed, rested, entertained].reduce((sum, a) => sum + a) === 0) {
        setActiveNotification({} as NotificationResponseTypes);
        setActiveNotification(undefined);
      } else {
        if (Object.keys(notification).length) {
          const minValue = Object.entries(notification).sort(([key1, v1], [key2, v2]) => v1 - v2)[0];
          if (minValue) {
            setActiveNotification(minValue[0] as NotificationResponseTypes);
          } else setActiveNotification(undefined);
        }
      }
    }
  }, [notification, tamagotchi]);

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (meta && lesson?.step === 5 && tamagotchi) {
      const { fed, rested, entertained } = tamagotchi;
      if ([fed, rested, entertained].reduce((sum, a) => sum + a) === 0) {
        unsub = api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data }: UserMessageSent) => {
          const {
            message: { payload },
          } = data;

          const decodedPayload = meta.createType(8, payload).toHuman() as NotificationResponseTypes;

          if (tamagotchi && ['WantToSleep', 'PlayWithMe', 'FeedMe'].includes(decodedPayload)) {
            const update = getNotificationTypeValue(decodedPayload, tamagotchi);
            setNotification((arg) => ({ ...arg, ...update }));
          }
        });
      }
    }

    return () => {
      if (unsub) unsub.then((unsubCallback) => unsubCallback());
    };
  }, [lesson, meta, tamagotchi]);

  return {
    notification,
    setNotification,
    activeNotification,
    setActiveNotification,
  };
};
