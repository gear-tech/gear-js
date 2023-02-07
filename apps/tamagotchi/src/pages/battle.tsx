import { TamagotchiBattleInfoCard } from '../components/tamagotchi/tamagotchi-battle-info-card';
import { TamagotchiAvatar } from '../components/tamagotchi/tamagotchi-avatar';
import { Icon } from '../components/ui/icon';
import { buttonStyles } from '@gear-js/ui';
import { useBattleMessage, useInitBattleData } from 'app/hooks/use-battle';
import { StartBattleForm } from 'components/forms/start-battle-form';
import clsx from 'clsx';
import { TamagotchiBattleTopStats } from 'components/tamagotchi/tamagotchi-battle-top-stats';
import { useEffect, useState } from 'react';
import { TamagotchiState } from 'app/types/lessons';
import { useApp, useBattle, useFTStore } from 'app/context';
import { useAccount } from '@gear-js/react-hooks';
import { getAttributesById } from 'app/utils';
import { getTamagotchiAgeDiff } from 'app/utils/get-tamagotchi-age';

export const Battle = () => {
  const { account } = useAccount();
  const { isPending, setIsPending } = useApp();
  const { store } = useFTStore();
  const { battleState: battle, players: warriors, setBattleState } = useBattle();
  useInitBattleData();
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [winner, setWinner] = useState<TamagotchiState>();
  const sendMessage = useBattleMessage();

  const handleAttack = () => {
    const onError = () => setIsPending(false);
    const onSuccess = () => setIsPending(false);
    if (battle?.state === 'GameIsOver') {
      setIsPending(true);
      sendMessage(
        { StartNewGame: null },
        {
          onSuccess: () => {
            setBattleState(undefined);
            setIsPending(false);
          },
          onError,
        },
      );
    }
    if (battle?.state === 'Moves') {
      setIsPending(true);
      sendMessage({ MakeMove: null }, { onError, onSuccess });
    }
  };

  useEffect(() => {
    if (battle?.state === 'GameIsOver' && warriors) {
      setWinner(warriors[battle.players.findIndex((p) => p.tmgId === battle.winner)]);
    }
    // console.log({ battle });
  }, [battle, warriors]);

  useEffect(() => {
    if (battle && account) {
      setIsAllowed(battle.players.filter((player) => player.owner === account.decodedAddress).length > 0);
    }
  }, [battle, account]);

  return (
    <>
      {battle &&
        (battle?.state !== 'Registration' && warriors.length > 0 ? (
          isAllowed ? (
            <>
              {/*Top*/}
              <div className="flex gap-10 justify-between items-center">
                <TamagotchiBattleTopStats
                  state={battle?.state}
                  isWinner={battle?.winner === battle?.players[0]?.tmgId}
                  health={Math.round(warriors[0].energy / 100)}>
                  <TamagotchiAvatar
                    inBattle
                    className="w-30 xl:w-50 aspect-square -left-1/2"
                    age={getTamagotchiAgeDiff(warriors[0].dateOfBirth)}
                    hasItem={getAttributesById(store, battle.players[0].attributes)}
                    isActive={battle?.currentTurn === 0 && battle?.state !== 'GameIsOver'}
                    isWinner={battle?.state === 'GameIsOver' && battle.winner === battle.players[0].tmgId}
                  />
                </TamagotchiBattleTopStats>
                {battle?.state === 'Moves' && (
                  <div className={clsx('flex', battle?.currentTurn === 1 && 'rotate-180')}>
                    <Icon
                      name="battle-next-step"
                      className="w-6 xl:w-10 aspect-[1/2] text-white animate-battle-turn-1 transition-opacity"
                    />
                    <Icon
                      name="battle-next-step"
                      className="w-6 xl:w-10 aspect-[1/2] text-white animate-battle-turn-2 transition-opacity"
                    />
                    <Icon
                      name="battle-next-step"
                      className="w-6 xl:w-10 aspect-[1/2] text-white animate-battle-turn-3 transition-opacity"
                    />
                  </div>
                )}
                <TamagotchiBattleTopStats
                  state={battle?.state}
                  isWinner={battle?.winner === battle?.players[1]?.tmgId}
                  health={Math.round(warriors[1].energy / 100)}
                  isReverse>
                  <TamagotchiAvatar
                    inBattle
                    className="w-30 xl:w-50 aspect-square -left-1/2"
                    age={getTamagotchiAgeDiff(warriors[1].dateOfBirth)}
                    hasItem={getAttributesById(store, battle.players[1].attributes)}
                    isActive={battle?.currentTurn === 1 && battle?.state !== 'GameIsOver'}
                    isWinner={battle?.state === 'GameIsOver' && battle.winner === battle.players[1].tmgId}
                  />
                </TamagotchiBattleTopStats>
              </div>
              {/*Avatars*/}
              <div className="relative grow grid grid-cols-[repeat(2,minmax(auto,445px))] justify-between gap-10 mt-10 xl:mt-15">
                <div className="w-full h-full flex flex-col">
                  <TamagotchiAvatar
                    inBattle
                    age={getTamagotchiAgeDiff(warriors[0].dateOfBirth)}
                    hasItem={getAttributesById(store, battle.players[0].attributes)}
                    energy={warriors[1]?.energy}
                    className="grow w-full h-full "
                    isActive={battle?.currentTurn === 0 && battle?.state !== 'GameIsOver'}
                    isWinner={battle?.state === 'GameIsOver' && battle.winner === battle.players[0].tmgId}
                    isDead={battle?.state === 'GameIsOver' && battle.winner !== battle.players[0].tmgId}
                  />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-8">
                  {winner && (
                    <p className="flex flex-col items-center">
                      <strong className="text-2xl leading-normal xl:typo-h2 text-primary truncate max-w-[9ch]">
                        {winner.name}
                      </strong>
                      <span className="text-[60px] leading-[1.2] font-bold xl:typo-h1">Win</span>
                    </p>
                  )}

                  <button
                    className={clsx(
                      'btn items-center gap-2 min-w-[250px]',
                      battle?.state === 'Moves'
                        ? 'bg-error text-white hover:bg-red-600 transition-colors'
                        : battle?.state === 'GameIsOver'
                        ? buttonStyles.secondary
                        : buttonStyles.primary,
                      buttonStyles.button,
                    )}
                    onClick={handleAttack}
                    disabled={isPending}>
                    <Icon name="swords" className="w-5 h-5" />{' '}
                    {battle?.state === 'Moves'
                      ? 'Attack'
                      : battle?.state === 'Waiting'
                      ? 'Wait...'
                      : battle?.state === 'GameIsOver'
                      ? 'Finish Game'
                      : ''}
                  </button>
                </div>
                <div className="w-full h-full flex flex-col">
                  <TamagotchiAvatar
                    inBattle
                    age={getTamagotchiAgeDiff(warriors[1].dateOfBirth)}
                    hasItem={getAttributesById(store, battle.players[1].attributes)}
                    energy={warriors[0].energy}
                    className="grow w-full h-full "
                    isActive={battle?.currentTurn === 1 && battle?.state !== 'GameIsOver'}
                    isWinner={battle?.state === 'GameIsOver' && battle.winner === battle.players[1].tmgId}
                    isDead={battle?.state === 'GameIsOver' && battle.winner !== battle.players[1].tmgId}
                  />
                </div>
              </div>
              {/*Info*/}
              <div className="flex gap-10 justify-between mt-8 xl:mt-10">
                <div className="basis-[445px] flex flex-col">
                  <TamagotchiBattleInfoCard tamagotchi={warriors[0]} />
                </div>
                <div className="basis-[445px] flex flex-col">
                  <TamagotchiBattleInfoCard tamagotchi={warriors[1]} />
                </div>
              </div>
            </>
          ) : (
            <p className="m-auto text-white/70">Please, wait. Current battle is not finished.</p>
          )
        ) : (
          <StartBattleForm />
        ))}
    </>
  );
};
