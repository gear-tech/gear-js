import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Icon } from 'components/ui/icon';
import { StoreItemsNames } from 'app/types/ft-store';
import { useLesson } from 'app/context';

type Emotions = 'hello' | 'happy' | 'angry' | 'scared' | 'crying';

type TamagotchiAvatarProps = {
  emotion?: Emotions;
  age?: 'baby' | 'adult' | 'old';
  isDead?: boolean;
  hasItem?: StoreItemsNames[];
  color?: string;
  className?: string;
  isActive?: boolean;
  isWinner?: boolean;
  energy?: number;
};

export const TamagotchiAvatar = ({
  className,
  emotion = 'happy',
  age = 'baby',
  isDead,
  hasItem = [],
  color,
  isActive,
  isWinner,
  energy,
}: TamagotchiAvatarProps) => {
  const { tamagotchi, tamagotchiItems, lesson } = useLesson();
  const [dead, setDead] = useState<boolean>(Boolean(isDead));
  const [currentEmotion, setCurrentEmotion] = useState<Emotions>(emotion);
  const [damage, setDamage] = useState<number>(0);
  const info = useRef({ isReady: false, energy: 0 });

  const [itemsUsed, setItemsUsed] = useState<StoreItemsNames[]>(hasItem);

  useEffect(() => {
    if (tamagotchiItems) {
      setItemsUsed(tamagotchiItems);
    }
  }, [tamagotchiItems]);

  useEffect(() => {
    setDamage(0);
    if (energy && !isActive) {
      if (info.current.isReady && info.current.energy !== energy) {
        setDamage(Math.round((energy - info.current.energy) / 100));
      } else {
        info.current.isReady = true;
        info.current.energy = energy;
      }
    }
  }, [energy]);

  useEffect(() => {
    if (tamagotchi) {
      setDead(tamagotchi.isDead);
    }
  }, [tamagotchi]);

  useEffect(() => {
    if (tamagotchi && lesson) {
      const { fed, entertained, rested } = tamagotchi;

      if (Number(lesson.step) > 1) {
        setCurrentEmotion(
          dead
            ? 'scared'
            : isWinner
            ? 'hello'
            : 4000 > Math.min.apply(null, [fed, rested, entertained])
            ? 'crying'
            : 6000 > Math.min.apply(null, [fed, rested, entertained])
            ? 'angry'
            : emotion,
        );
      }
    }
  }, [dead, emotion, isWinner, lesson, tamagotchi]);

  const s = 'tamagotchi';
  const cn = 'absolute inset-0 w-full h-full';
  const tamagotchiDied = isDead || dead;
  const emo: Emotions = tamagotchiDied ? 'scared' : isWinner ? 'hello' : currentEmotion;

  const mouse = age === 'baby' ? 'face-baby' : `mouse-${age}-${emo === 'hello' ? 'happy' : emo}`;
  const head = `head-${age}`;
  const eye = `eye-${emo === 'hello' ? 'happy' : emo}`;
  const hands = `hands-${
    itemsUsed?.includes('sword') ? 'sword' : emo === 'hello' ? 'hello' : emo === 'angry' ? 'angry' : 'normal'
  }`;
  const tail = `tail-${itemsUsed?.includes('sword') ? 'sword' : emo === 'hello' ? 'hello' : 'normal'}`;
  const glasses = itemsUsed?.includes('glasses') ? 'head-glasses' : age === 'old' ? 'face-old-glasses' : null;
  const body = `body-${tamagotchiDied ? 'dead' : 'normal'}`;

  return (
    <div className={clsx('relative text-[#16B768]', className ?? 'grow w-full h-30 aspect-square')}>
      {!tamagotchiDied && <Icon name={tail} section={s} className={cn} />}
      {!tamagotchiDied && <Icon name={hands} section={s} className={cn} />}
      <Icon name={body} section={s} className={cn} />
      {itemsUsed?.includes('bag') && <Icon name="body-bag" section={s} className={cn} />}
      <Icon name={head} section={s} className={cn} />
      <Icon name={mouse} section={s} className={cn} />
      <Icon name={eye} section={s} className={cn} />
      {!tamagotchiDied && glasses && <Icon name={glasses} section={s} className={cn} />}
      {!tamagotchiDied && itemsUsed?.includes('hat') && <Icon name="head-hat" section={s} className={cn} />}
      {emo === 'crying' && <Icon name="tears" section={s} className={cn} />}
      {!tamagotchiDied && (isActive || isWinner) && (
        <div className="absolute top-full -z-1 left-1/2 -translate-x-1/2">
          <div
            className={clsx(
              'animate-pulse opacity-70 blur-2xl w-64 h-40',
              isActive && 'bg-white',
              isWinner && 'bg-primary',
            )}
          />
        </div>
      )}
      {Boolean(damage) && (
        <div className="absolute top-1/4 right-15 w-12 h-12 grid place-items-center">
          <Icon name="damage" section={s} className="absolute inset-0 w-full h-full" />
          <span className="relative z-1 text-white font-bold">{damage}</span>
        </div>
      )}
    </div>
  );
};
