import { TamagotchiInfoCard } from 'components/tamagotchi/tamagotchi-info-card';
import { TamagotchiAvatar } from 'components/tamagotchi/tamagotchi-avatar';
import { ConnectAccount } from 'components/common/connect-account';
import { useLesson } from 'app/context';
import { useEffect, useState } from 'react';
import { StoreItemsNames } from 'app/types/ft-store';
import { getOwnItems } from 'app/utils/get-own-items';
import { useItemsStore } from 'app/hooks/use-store';

export const HomeCreateSection = () => {
  const { lesson, tamagotchiItems, tamagotchi } = useLesson();
  useItemsStore();
  const [ownItems, setOwnItems] = useState<StoreItemsNames[]>([]);

  useEffect(() => {
    tamagotchiItems && setOwnItems(getOwnItems(tamagotchiItems));
    // console.log(ownItems);
    return () => setOwnItems([]);
  }, [tamagotchiItems]);

  return (
    <section className="grid grid-rows-[1fr_auto_auto] h-[calc(100vh-216px)]">
      <div className="grow flex flex-col justify-center text-center">
        {lesson ? (
          tamagotchi && <TamagotchiAvatar hasItem={ownItems} />
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
