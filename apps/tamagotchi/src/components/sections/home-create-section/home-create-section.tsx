import { CharacterStats } from 'components/common/character-stats';
import { CharacterAvatar } from 'components/common/character-avatar';
import { ConnectAccount } from 'components/common/connect-account';
import { useState } from 'react';

export const HomeCreateSection = () => {
  const [state, setState] = useState(false);

  return (
    <section className="grid grid-rows-[1fr_auto_auto] h-[calc(100vh-196px)]">
      <div className="grow flex flex-col justify-center text-center">
        <CharacterAvatar />
      </div>
      <div className="mt-12 flex flex-col items-center gap-9">
        {state ? <CharacterStats simple /> : <ConnectAccount />}
      </div>
    </section>
  );
};
