import { CharacterStats } from 'components/common/character-stats';
import { CharacterAvatar } from 'components/common/character-avatar';
import { ConnectAccount } from 'components/common/connect-account';
import { useLesson } from 'app/context';

export const HomeCreateSection = () => {
  const { lesson } = useLesson();
  return (
    <section className="grid grid-rows-[1fr_auto_auto] h-[calc(100vh-216px)]">
      <div className="grow flex flex-col justify-center text-center">
        <CharacterAvatar lesson={Number(lesson?.step)} />
      </div>
      <div className="mt-12 flex flex-col items-center gap-9">{lesson ? <CharacterStats /> : <ConnectAccount />}</div>
    </section>
  );
};
