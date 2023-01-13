import { Icon } from 'components/ui/icon';

export const CharacterAvatar = ({ lesson }: { lesson: number }) => {
  return (
    <>
      {lesson > 1 ? (
        <div className="relative grow text-[#16B768] w-full h-30 aspect-square">
          <Icon name="tail" section="tamagotchi" className="absolute inset-0 w-full h-full" />
          <Icon name="hands-down" section="tamagotchi" className="absolute inset-0 w-full h-full" />
          <Icon name="body-normal" section="tamagotchi" className="absolute inset-0 w-full h-full" />
          <Icon name="head-basis" section="tamagotchi" className="absolute inset-0 w-full h-full" />
          <Icon name="face-basis" section="tamagotchi" className="absolute inset-0 w-full h-full" />
          <Icon name="face-baby" section="tamagotchi" className="absolute inset-0 w-full h-full" />
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
