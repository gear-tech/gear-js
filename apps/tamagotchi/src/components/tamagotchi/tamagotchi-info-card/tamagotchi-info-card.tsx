import clsx from 'clsx';
import { useLesson } from 'app/context';
import { AccountActionsMenu } from 'components/menus/account-actions-menu';
import { getTamagotchiAge } from 'app/utils/get-tamagotchi-age';
import { useTamagotchiMessage } from 'app/hooks/use-tamagotchi';
import { useAccount } from '@gear-js/react-hooks';
import { useTamagotchi } from 'app/hooks/use-tamagotchi';
import { useThrottleWasmState } from 'app/hooks/use-read-wasm-state';
import { TamagotchiInfoCardRow } from '../tamagotchi-info-card-row';
import { useLesson5 } from 'app/hooks/use-lesson-5';
import { NotificationResponseTypes } from 'app/types/lessons';
import { useState } from 'react';
import { getNotificationTypeValue } from 'app/utils';

export const TamagotchiInfoCard = () => {
  const { account } = useAccount();
  const { tamagotchi, lesson } = useLesson();
  const { setNotification, activeNotification, setActiveNotification } = useLesson5();
  const [pending, setPending] = useState(false);
  const send = useTamagotchiMessage();

  useTamagotchi();
  useThrottleWasmState();

  const fullView = Boolean(lesson && lesson?.step > 1);

  const onSuccess = (str: NotificationResponseTypes) => {
    if (activeNotification) {
      setNotification((prev) => ({ ...prev, ...getNotificationTypeValue(str) }));
      setActiveNotification(undefined);
    }
    setPending(false);
  };
  const onError = () => setPending(false);
  const feedHandler = () => {
    setPending(true);
    send({ Feed: null }, { onSuccess: () => onSuccess('FeedMe'), onError });
  };
  const playHandler = () => {
    setPending(true);
    send(
      { Play: null },
      {
        onSuccess: () => onSuccess('PlayWithMe'),
        onError,
      },
    );
  };
  const sleepHandler = () => {
    setPending(true);
    send(
      { Sleep: null },
      {
        onSuccess: () => onSuccess('WantToSleep'),
        onError,
      },
    );
  };

  return (
    <>
      {tamagotchi && (
        <div className={clsx('flex gap-12 items-center p-4 bg-white/5 rounded-2xl', fullView && 'w-full pr-12')}>
          <div className="basis-[415px] w-full px-8 py-6 bg-[#1E1E1E] rounded-2xl">
            <div className="flex justify-between gap-4">
              <h2 className="typo-h2 text-primary truncate">{tamagotchi.name ? tamagotchi.name : 'Geary'}</h2>
              <div>
                <AccountActionsMenu isPending={pending} />
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
                tooltipText={
                  'Your character has a low fed score. In order to increase the level, please click on the "Feed" button'
                }
                tooltipTitle="Low level of fed"
                isActive={activeNotification === 'FeedMe'}
                isPending={pending}
              />
              <TamagotchiInfoCardRow
                label="Happy"
                value={tamagotchi.entertained}
                icon="happy"
                labelBtn="Play"
                onClick={playHandler}
                tooltipText={
                  'Your character has a low happiness score. In order to increase the level, please click on the "Play" button'
                }
                tooltipTitle="Low level of happiness"
                isActive={activeNotification === 'PlayWithMe'}
                isPending={pending}
              />
              <TamagotchiInfoCardRow
                label="Tired"
                value={tamagotchi.rested}
                icon="tired"
                labelBtn="Sleep"
                onClick={sleepHandler}
                tooltipText={
                  'Your character has a low rest score. In order to increase the level, please click on the "Sleep" button'
                }
                tooltipTitle="Low level of rest"
                isActive={activeNotification === 'WantToSleep'}
                isPending={pending}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
