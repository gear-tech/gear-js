import { CharacterStats } from 'components/common/character-stats';
import { CharacterAvatar } from 'components/common/character-avatar';
import { ConnectAccount } from 'components/common/connect-account';
import { useContext, useState } from 'react';
import { LessonsContext } from 'app/context';

export const HomeCreateSection = () => {
  const { tamagotchi } = useContext(LessonsContext);

  return (
    <section className="grid grid-rows-[1fr_auto_auto] h-[calc(100vh-196px)]">
      <div className="grow flex flex-col justify-center text-center">
        <CharacterAvatar />
      </div>
      <div className="mt-12 flex flex-col items-center gap-9">
        {tamagotchi ? <CharacterStats simple /> : <ConnectAccount />}
      </div>
    </section>
  );
};
