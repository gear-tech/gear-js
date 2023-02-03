import { AlertContainerFactory } from '@gear-js/react-hooks';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { LOCAL_STORAGE } from '../consts';
import { NotificationResponseTypes, NotificationType, TamagotchiState } from '../types/lessons';

export const copyToClipboard = async (key: string, alert: AlertContainerFactory, successfulText?: string) => {
  try {
    await navigator.clipboard.writeText(key);
    alert.success(successfulText || 'Copied');
  } catch (err) {
    alert.error('Copy error');
  }
};
export const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;

export const getNotificationTypeValue = (
  str: NotificationResponseTypes,
  tamagotchi?: TamagotchiState,
): NotificationType => {
  switch (str) {
    case 'FeedMe':
      return { FeedMe: tamagotchi ? tamagotchi?.fed : undefined };
    case 'PlayWithMe':
      return { PlayWithMe: tamagotchi ? tamagotchi?.entertained : undefined };
    case 'WantToSleep':
      return { WantToSleep: tamagotchi ? tamagotchi?.rested : undefined };
  }
};
