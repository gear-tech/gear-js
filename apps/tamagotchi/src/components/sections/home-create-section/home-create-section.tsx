import { CharacterStats } from 'components/common/character-stats';
import { CharacterAvatar } from 'components/common/character-avatar';
import { ConnectAccount } from 'components/common/connect-account';
import { useContext } from 'react';
import { TmgContext } from 'app/context';
// import { CreateType } from '@gear-js/api';
// import { useAccount } from '@gear-js/react-hooks';

export const HomeCreateSection = () => {
  // const { account } = useAccount();
  const { state } = useContext(TmgContext);
  // const result = CreateType.create('TokenContractMessage', {
  //   Mint: { recipient: account?.decodedAddress, amount: 2000 },
  // });
  //
  // console.log(result);

  return (
    <section className="grid grid-rows-[1fr_auto_auto] h-[calc(100vh-216px)]">
      <div className="grow flex flex-col justify-center text-center">
        <CharacterAvatar lesson={Number(state?.lesson)} />
      </div>
      <div className="mt-12 flex flex-col items-center gap-9">
        {state?.tamagotchi ? <CharacterStats /> : <ConnectAccount />}
      </div>
    </section>
  );
};
