import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { TamagotchiAvatarAge } from '../types/tamagotchi';

export const getTamagotchiAge = (v: number) => {
  dayjs.extend(relativeTime);
  return dayjs(v).fromNow(true);
};

export const getTamagotchiAgeDiff = (v: number): TamagotchiAvatarAge => {
  const diff = dayjs().diff(dayjs(v), 'minutes');
  return diff > 60 ? 'old' : diff > 20 ? 'adult' : 'baby';
};
