import { Icon } from 'components/ui/icon';

type CharacterAvatarProps = {
  lesson: number;
  emotion?: 'hello' | 'happy' | 'angry' | 'scared' | 'crying';
  age?: 'baby' | 'adult' | 'old';
  hasItem?: ('sword' | 'hat' | 'bag' | 'glasses')[];
  color?: string;
};
export const CharacterAvatar = ({
  lesson,
  emotion = 'hello',
  age = 'baby',
  hasItem = ['hat', 'bag'],
  color,
}: CharacterAvatarProps) => {
  const s = 'tamagotchi';
  const cn = 'absolute inset-0 w-full h-full';
  const mouse = age === 'baby' ? 'face-baby' : `mouse-${age}-${emotion === 'hello' ? 'happy' : emotion}`;
  const head = `head-${age}`;
  const eye = `eye-${emotion === 'hello' ? 'happy' : emotion}`;
  const hands = `hands-${
    hasItem?.includes('sword') ? 'sword' : emotion === 'hello' ? 'hello' : emotion === 'angry' ? 'angry' : 'normal'
  }`;
  const tail = `tail-${hasItem?.includes('sword') ? 'sword' : emotion === 'hello' ? 'hello' : 'normal'}`;
  const glasses = hasItem?.includes('glasses') ? 'head-glasses' : age === 'old' ? 'face-old-glasses' : null;

  return (
    <>
      {lesson > 1 ? (
        <div className="relative grow text-[#16B768] w-full h-30 aspect-square">
          <Icon name={tail} section={s} className={cn} />
          <Icon name={hands} section={s} className={cn} />
          <Icon name="body-normal" section={s} className={cn} />
          {hasItem?.includes('bag') && <Icon name="body-bag" section={s} className={cn} />}
          <Icon name={head} section={s} className={cn} />
          <Icon name={mouse} section={s} className={cn} />
          <Icon name={eye} section={s} className={cn} />
          {glasses && <Icon name={glasses} section={s} className={cn} />}
          {hasItem?.includes('hat') && <Icon name="head-hat" section={s} className={cn} />}
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
