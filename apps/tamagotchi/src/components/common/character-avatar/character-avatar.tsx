import { Icon } from 'components/ui/icon';
import { useEffect, useState } from 'react';
import { useLesson } from 'app/context';

type TamagotchiItem = 'sword' | 'hat' | 'bag' | 'glasses';

type CharacterAvatarProps = {
  lesson: number;
  emotion?: 'hello' | 'happy' | 'angry' | 'scared' | 'crying';
  age?: 'baby' | 'adult' | 'old';
  state?: 'normal' | 'dead';
  hasItem?: TamagotchiItem[];
  color?: string;
};

const getOwnItems = (a: number[]) => {
  const res: TamagotchiItem[] = [];
  a.includes(1) && res.push('sword');
  a.includes(2) && res.push('hat');
  a.includes(3) && res.push('glasses');
  a.includes(4) && res.push('bag');
  return res;
};
export const CharacterAvatar = ({
  lesson,
  emotion = 'happy',
  age = 'baby',
  state = 'normal',
  color,
}: CharacterAvatarProps) => {
  const [ownItems, setOwnItems] = useState<TamagotchiItem[]>([]);
  const { tamagotchiItems } = useLesson();

  const s = 'tamagotchi';
  const cn = 'absolute inset-0 w-full h-full';
  const mouse = age === 'baby' ? 'face-baby' : `mouse-${age}-${emotion === 'hello' ? 'happy' : emotion}`;
  const head = `head-${age}`;
  const eye = `eye-${emotion === 'hello' ? 'happy' : emotion}`;
  const hands = `hands-${
    ownItems?.includes('sword') ? 'sword' : emotion === 'hello' ? 'hello' : emotion === 'angry' ? 'angry' : 'normal'
  }`;
  const tail = `tail-${ownItems?.includes('sword') ? 'sword' : emotion === 'hello' ? 'hello' : 'normal'}`;
  const glasses = ownItems?.includes('glasses') ? 'head-glasses' : age === 'old' ? 'face-old-glasses' : null;
  const body = `body-${state}`;

  useEffect(() => {
    tamagotchiItems && setOwnItems(getOwnItems(tamagotchiItems));

    return () => setOwnItems([]);
  }, [tamagotchiItems]);

  return (
    <>
      {lesson > 1 ? (
        <div className="relative grow text-[#16B768] w-full h-30 aspect-square">
          <Icon name={tail} section={s} className={cn} />
          <Icon name={hands} section={s} className={cn} />
          <Icon name={body} section={s} className={cn} />
          {ownItems?.includes('bag') && <Icon name="body-bag" section={s} className={cn} />}
          <Icon name={head} section={s} className={cn} />
          <Icon name={mouse} section={s} className={cn} />
          <Icon name={eye} section={s} className={cn} />
          {glasses && <Icon name={glasses} section={s} className={cn} />}
          {ownItems?.includes('hat') && <Icon name="head-hat" section={s} className={cn} />}
          {emotion === 'crying' && <Icon name="tears" section={s} className={cn} />}
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
