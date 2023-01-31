import { Icon } from 'components/ui/icon';
import { StoreItemsNames } from 'app/types/ft-store';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

type Emotions = 'hello' | 'happy' | 'angry' | 'scared' | 'crying';

type CharacterAvatarProps = {
  lesson: number;
  emotion?: Emotions;
  age?: 'baby' | 'adult' | 'old';
  state?: 'normal' | 'dead';
  hasItem?: StoreItemsNames[];
  color?: string;
  className?: string;
  isActive?: boolean;
  isWinner?: boolean;
  energy?: number;
};
export const CharacterAvatar = ({
  className,
  lesson,
  emotion = 'happy',
  age = 'baby',
  state = 'normal',
  hasItem,
  color,
  isActive,
  isWinner,
  energy,
}: CharacterAvatarProps) => {
  const [damage, setDamage] = useState<number>(0);
  const info = useRef({ isReady: false, energy: 0 });

  useEffect(() => {
    if (energy) {
      if (info.current.isReady && info.current.energy !== energy) {
        setDamage(Math.round((energy - info.current.energy) / 100));
      } else {
        info.current.isReady = true;
        info.current.energy = energy;
      }
    }
  }, [energy]);

  const s = 'tamagotchi';
  const cn = 'absolute inset-0 w-full h-full';
  const isDead = state === 'dead';
  const emo: Emotions = isDead ? 'scared' : isWinner ? 'hello' : emotion;

  const mouse = age === 'baby' ? 'face-baby' : `mouse-${age}-${emo === 'hello' ? 'happy' : emo}`;
  const head = `head-${age}`;
  const eye = `eye-${emo === 'hello' ? 'happy' : emo}`;
  const hands = `hands-${
    hasItem?.includes('sword') ? 'sword' : emo === 'hello' ? 'hello' : emo === 'angry' ? 'angry' : 'normal'
  }`;
  const tail = `tail-${hasItem?.includes('sword') ? 'sword' : emo === 'hello' ? 'hello' : 'normal'}`;
  const glasses = hasItem?.includes('glasses') ? 'head-glasses' : age === 'old' ? 'face-old-glasses' : null;
  const body = `body-${state}`;

  return (
    <>
      {lesson > 1 ? (
        <div className={clsx('relative text-[#16B768]', className ?? 'grow w-full h-30 aspect-square')}>
          {!isDead && <Icon name={tail} section={s} className={cn} />}
          {!isDead && <Icon name={hands} section={s} className={cn} />}
          <Icon name={body} section={s} className={cn} />
          {hasItem?.includes('bag') && <Icon name="body-bag" section={s} className={cn} />}
          <Icon name={head} section={s} className={cn} />
          <Icon name={mouse} section={s} className={cn} />
          <Icon name={eye} section={s} className={cn} />
          {!isDead && glasses && <Icon name={glasses} section={s} className={cn} />}
          {!isDead && hasItem?.includes('hat') && <Icon name="head-hat" section={s} className={cn} />}
          {emo === 'crying' && <Icon name="tears" section={s} className={cn} />}
          {!isDead && (isActive || isWinner) && (
            <div className="absolute top-full -z-1 left-1/2 -translate-x-1/2">
              <div
                className={clsx(
                  'animate-pulse opacity-70 blur-2xl w-64 h-40',
                  isActive && 'bg-white',
                  isWinner && 'bg-[#2BD071]',
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
      ) : (
        <img
          className="grow w-full h-30 aspect-[45/56]"
          src="/images/avatar.svg"
          width={448}
          height={560}
          alt="Img"
          loading="lazy"
        />
      )}
    </>
  );
};
