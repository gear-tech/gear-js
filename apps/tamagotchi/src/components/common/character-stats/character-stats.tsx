import { useContext, useEffect } from 'react';
import clsx from 'clsx';
import { Button, buttonStyles } from '@gear-js/ui';
import { TmgContext } from 'app/context';
import { Icon } from 'components/ui/icon';
import { AccountActionsMenu } from 'components/menus/account-actions-menu';
import { getTamagotchiAge } from 'app/utils/get-tamagotchi-age';
import { useTamagocthiMessage } from 'app/hooks/use-tamagotchi-message';
import { useUpdateState } from 'app/hooks/use-update-state';
import { useAccount } from '@gear-js/react-hooks';

export const CharacterStats = () => {
  const { account } = useAccount();
  const { state } = useContext(TmgContext);
  const sendHandler = useTamagocthiMessage();
  const { update } = useUpdateState();

  const baseView = !state?.tamagotchi?.entertained;
  const onSuccess = () => update();
  const feedHandler = () => sendHandler({ Feed: null }, { onSuccess });
  const playHandler = () => sendHandler({ Play: null }, { onSuccess });
  const sleepHandler = () => sendHandler({ Sleep: null }, { onSuccess });

  useEffect(() => {
    if (!state?.isDirty) {
      update();
    }
  }, [state?.isDirty, update]);

  return (
    <>
      {state?.tamagotchi && (
        <div className={clsx('flex gap-12 items-center p-4 bg-white/5 rounded-2xl', !baseView && 'w-full')}>
          <div className="basis-[415px] w-full px-8 py-6 bg-[#1E1E1E] rounded-2xl">
            <div className="flex justify-between gap-4">
              <h2 className="typo-h2 text-primary truncate">{state.tamagotchi.name}</h2>
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
                    <td className="flex-1 w-40">{getTamagotchiAge(state.tamagotchi.dateOfBirth)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {state.tamagotchi.entertained && (
            <div className="basis-[620px] w-full space-y-6 grow">
              <div className="flex gap-12 items-center">
                <div className="basis-30 grow">
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-3 text-base leading-5">
                      <span className="inline-flex gap-2 items-center text-white/70 font-kanit font-medium">
                        <Icon name="food-tray" className="w-5 h-5" /> Hungry:
                      </span>
                      <span>{state.tamagotchi.fed / 1000}</span>
                    </div>
                    <div className="relative mt-3 bg-white/15 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0 bg-primary"
                        style={{ width: `${state.tamagotchi.fed / 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="basis-50">
                  <Button
                    className={clsx(buttonStyles.light, 'gap-2 w-full')}
                    text="Feed"
                    icon={() => <Icon name="moon" className="w-5 h-5" />}
                    onClick={feedHandler}
                  />
                </div>
              </div>
              <div className="flex gap-12 items-center">
                <div className="basis-30 grow">
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-3 text-base leading-5">
                      <span className="inline-flex gap-2 items-center text-white/70 font-kanit font-medium">
                        <Icon name="happy" className="w-5 h-5" /> Happy:
                      </span>
                      <span>{state.tamagotchi.entertained / 1000}</span>
                    </div>
                    <div className="relative mt-3 bg-white/15 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0 bg-primary"
                        style={{ width: `${state.tamagotchi.entertained / 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="basis-50">
                  <Button
                    className={clsx(buttonStyles.light, 'gap-2 w-full')}
                    text="Play"
                    icon={() => <Icon name="video-game" className="w-5 h-5" />}
                    onClick={playHandler}
                  />
                </div>
              </div>
              <div className="flex gap-12 items-center">
                <div className="basis-30 grow">
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-3 text-base leading-5">
                      <span className="inline-flex gap-2 items-center text-white/70 font-kanit font-medium">
                        <Icon name="tired" className="w-5 h-5" /> Tired:
                      </span>
                      <span>{state.tamagotchi.rested / 1000}</span>
                    </div>
                    <div className="relative mt-3 bg-white/15 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0 bg-primary"
                        style={{ width: `${state.tamagotchi.rested / 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="basis-50">
                  <Button
                    className={clsx(buttonStyles.light, 'gap-2 w-full')}
                    text="Sleep"
                    icon={() => <Icon name="moon" className="w-5 h-5" />}
                    onClick={sleepHandler}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
