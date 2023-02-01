import clsx from 'clsx';
import { useLesson } from 'app/context';
import { AccountActionsMenu } from 'components/menus/account-actions-menu';
import { getTamagotchiAge } from 'app/utils/get-tamagotchi-age';
import { useTamagocthiMessage } from 'app/hooks/use-tamagotchi-message';
import { useAccount } from '@gear-js/react-hooks';
import { useTamagotchi } from 'app/hooks/use-tamagotchi';
import { useThrottleWasmState } from 'app/hooks/use-read-wasm-state';
import { TamagotchiInfoCardRow } from '../../tamagotchi/tamagotchi-info-card-row';
import { useLesson5 } from 'app/hooks/use-lesson-5';

export const CharacterStats = () => {
  useTamagotchi();
  useThrottleWasmState();
  useLesson5();

  const { account } = useAccount();
  const { tamagotchi, lesson } = useLesson();
  const sendHandler = useTamagocthiMessage();

  const fullView = Boolean(lesson && lesson?.step > 1);
  const feedHandler = () => sendHandler({ Feed: null });
  const playHandler = () => sendHandler({ Play: null });
  const sleepHandler = () => sendHandler({ Sleep: null });

  return (
    <>
      {tamagotchi && (
        <div className={clsx('flex gap-12 items-center p-4 bg-white/5 rounded-2xl', fullView && 'w-full')}>
          <div className="basis-[415px] w-full px-8 py-6 bg-[#1E1E1E] rounded-2xl">
            <div className="flex justify-between gap-4">
              <h2 className="typo-h2 text-primary truncate">{tamagotchi.name}</h2>
              <div className="">
                <AccountActionsMenu />
              </div>
            </div>
            <div className="mt-8 text-white text-lg font-medium">
              <table className="block w-full text-left">
                <tbody className="block space-y-8">
                  <tr className="flex gap-8">
                    <th className="flex-1 w-40 text-white text-opacity-70 font-medium">Owner ID:</th>
                    <td className="flex-1 w-40 truncate">{account?.meta.name}</td>
                  </tr>
                  <tr className="flex gap-8">
                    <th className="flex-1 w-40 text-white text-opacity-70 font-medium">Age:</th>
                    <td className="flex-1 w-40">{getTamagotchiAge(tamagotchi.dateOfBirth)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {fullView && (
            <div className="basis-[620px] w-full space-y-6 grow">
              <TamagotchiInfoCardRow
                label="Hungry"
                value={tamagotchi.fed}
                icon="feed"
                labelBtn="Feed"
                onClick={feedHandler}
              />
              <TamagotchiInfoCardRow
                label="Happy"
                value={tamagotchi.entertained}
                icon="happy"
                labelBtn="Play"
                onClick={playHandler}
              />
              <TamagotchiInfoCardRow
                label="Tired"
                value={tamagotchi.rested}
                icon="tired"
                labelBtn="Sleep"
                onClick={sleepHandler}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
