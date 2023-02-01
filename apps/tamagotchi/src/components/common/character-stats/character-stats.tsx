import clsx from 'clsx';
import { Button, buttonStyles } from '@gear-js/ui';
import { useLesson } from 'app/context';
import { Icon } from 'components/ui/icon';
import { AccountActionsMenu } from 'components/menus/account-actions-menu';
import { getTamagotchiAge } from 'app/utils/get-tamagotchi-age';
import { useTamagocthiMessage } from 'app/hooks/use-tamagotchi-message';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { useTamagotchi, useTamagotchiWasm } from 'app/hooks/use-tamagotchi';
import { useEffect } from 'react';
import { UnsubscribePromise } from '@polkadot/api/types';
import { u8, Vec } from '@polkadot/types';
import { HexString } from '@polkadot/util/types';

type MessagePayload = { GameFinished: { winner: HexString } } | string;

export const CharacterStats = () => {
  useTamagotchi();
  useTamagotchiWasm();

  const { account } = useAccount();
  const { tamagotchi, lesson, meta } = useLesson();
  const sendHandler = useTamagocthiMessage();
  const fullView = Boolean(lesson && lesson?.step > 1);
  const feedHandler = () => sendHandler({ Feed: null });
  const playHandler = () => sendHandler({ Play: null });
  const sleepHandler = () => sendHandler({ Sleep: null });

  const { api } = useApi();

  const getDecodedPayload = (payload: Vec<u8>) => {
    // handle_output is specific for contract
    if (meta) {
      return meta.createType(8, payload).toHuman();
    }
  };

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (meta) {
      unsub = api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data }) => {
        const { message } = data;
        const { source, payload } = message;

        if (source.toHex() === lesson?.programId) {
          console.log({ payload });
          const decodedPayload = getDecodedPayload(payload) as unknown;
          console.log({ decodedPayload });

          if (typeof decodedPayload === 'object' && decodedPayload !== null) {
            // if (decodedPayload.Step) {
            //   setSteps((prevSteps) => [...prevSteps, decodedPayload.Step]);
            // }
            // else if (decodedPayload.GameFinished) {
            //   setWinner(decodedPayload.GameFinished.winner);
            // }
          }
        }
      });
    }

    return () => {
      if (unsub) unsub.then((unsubCallback) => unsubCallback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta]);

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
              <div className="flex gap-12 items-center">
                <div className="basis-30 grow">
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-3 text-base leading-5">
                      <span className="inline-flex gap-2 items-center text-white/70 font-kanit font-medium">
                        <Icon name="food-tray" className="w-5 h-5" /> Hungry:
                      </span>
                      <span>{Math.round(Number(tamagotchi.fed) / 100) / 10}</span>
                    </div>
                    <div className="relative mt-3 bg-white/15 h-2.5 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-primary" style={{ width: `${tamagotchi.fed / 100}%` }} />
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
                      <span>{Math.round(tamagotchi.entertained / 100) / 10}</span>
                    </div>
                    <div className="relative mt-3 bg-white/15 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0 bg-primary"
                        style={{ width: `${tamagotchi.entertained / 100}%` }}
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
                      <span>{Math.round(tamagotchi.rested / 100) / 10}</span>
                    </div>
                    <div className="relative mt-3 bg-white/15 h-2.5 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-primary" style={{ width: `${tamagotchi.rested / 100}%` }} />
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
