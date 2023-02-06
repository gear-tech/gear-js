import { AlertContainerFactory } from '@gear-js/react-hooks';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { LOCAL_STORAGE } from '../consts';
import { NotificationResponseTypes, NotificationType, TamagotchiState } from '../types/lessons';
import { ItemsStoreResponse, StoreItemsNames, StoreItemType } from '../types/ft-store';
import { HexString } from '@polkadot/util/types';

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

export const getStoreItems = (state: ItemsStoreResponse, programId: HexString) => {
  if (!state) return { store: [], tamagotchi: [] };
  const store: StoreItemType[] = [];
  const tamagotchi: StoreItemsNames[] = [];
  for (const idx in state.attributes) {
    const isBought: boolean = state.owners[programId]?.includes(+idx);

    if (isBought) tamagotchi.push(state.attributes[+idx][0].media);

    store.push({
      id: +idx,
      amount: state.attributes[+idx][1],
      description: state.attributes[+idx][0],
      isBought,
    });
  }
  return { store, tamagotchi };
};
