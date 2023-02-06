import { TamagotchiInfoCard } from 'components/tamagotchi/tamagotchi-info-card';
import { TamagotchiAvatar } from 'components/tamagotchi/tamagotchi-avatar';
import { ConnectAccount } from 'components/common/connect-account';
import { useLessons, useTamagotchi } from 'app/context';

export const HomeCreateSection = () => {
  const { tamagotchi } = useTamagotchi();
  const { lesson } = useLessons();
  return (
    <section className="grid grid-rows-[1fr_auto_auto] h-[calc(100vh-216px)]">
      <div className="grow flex flex-col justify-center text-center">
        {lesson ? (
          tamagotchi && <TamagotchiAvatar />
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
      </div>
      <div className="mt-12 flex flex-col items-center gap-9">
        {lesson ? <TamagotchiInfoCard /> : <ConnectAccount />}
      </div>
    </section>
  );
};
