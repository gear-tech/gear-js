import { CharacterStats } from 'components/common/character-stats';
import { CharacterAvatar } from 'components/common/character-avatar';
import { ConnectAccount } from 'components/common/connect-account';
import { useLesson } from 'app/context';

export const HomeCreateSection = () => {
  const { lesson, tamagotchiItems } = useLesson();
  const transformToNames = () => {
    const res: ('sword' | 'hat' | 'bag' | 'glasses')[] = [];

    tamagotchiItems.forEach((item) => {
      if (item === 0) res.push('sword');
      if (item === 23) res.push('hat');
    });

    return res;
  };
  return (
    <section className="grid grid-rows-[1fr_auto_auto] h-[calc(100vh-216px)]">
      <div className="grow flex flex-col justify-center text-center">
        <CharacterAvatar lesson={Number(lesson?.step)} hasItem={transformToNames()} />
      </div>
      <div className="mt-12 flex flex-col items-center gap-9">{lesson ? <CharacterStats /> : <ConnectAccount />}</div>
    </section>
  );
};
