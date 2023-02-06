import { useEffect, useState } from 'react';
import type { UserMessageSent } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import type { UnsubscribePromise } from '@polkadot/api/types';
import { useLessons, useTamagotchi } from '../context';
import type { NotificationResponseTypes, NotificationType } from 'app/types/lessons';
import { getNotificationTypeValue } from 'app/utils';

export const useLesson5 = () => {
  const { api } = useApi();
  const [notification, setNotification] = useState<NotificationType>({});
  const [activeNotification, setActiveNotification] = useState<NotificationResponseTypes>();
  const { lesson, lessonMeta } = useLessons();
  const { tamagotchi } = useTamagotchi();

  useEffect(() => {
    if (tamagotchi) {
      if (tamagotchi.isDead) {
        setActiveNotification(undefined);
      } else {
        if (Object.keys(notification).length) {
          const minValue = Object.entries(notification)
            .filter((item) => Boolean(item[1]))
            .sort(([, v1], [, v2]) => v1 - v2)[0];
          if (minValue) {
            setActiveNotification(minValue[0] as NotificationResponseTypes);
          } else setActiveNotification(undefined);
        }
      }
    }
  }, [notification, tamagotchi]);

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (lessonMeta && lesson?.step === 5 && tamagotchi) {
      if (!tamagotchi.isDead) {
        unsub = api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data }: UserMessageSent) => {
          const {
            message: { payload },
          } = data;

          const decodedPayload = lessonMeta.createType(8, payload).toHuman() as NotificationResponseTypes;

          // console.log({ decodedPayload });

          if (tamagotchi && ['WantToSleep', 'PlayWithMe', 'FeedMe'].includes(decodedPayload)) {
            const update = getNotificationTypeValue(decodedPayload, tamagotchi);
            setNotification((prev) => ({ ...prev, ...update }));
          }
        });
      }
    }

    return () => {
      if (unsub) unsub.then((unsubCallback) => unsubCallback());
    };
  }, [lesson, lessonMeta, tamagotchi]);

  return {
    notification,
    setNotification,
    activeNotification,
    setActiveNotification,
  };
};
