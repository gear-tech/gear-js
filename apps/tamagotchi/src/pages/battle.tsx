import { TamagotchiBattleInfoCard } from '../components/tamagotchi/tamagotchi-battle-info-card';
import { TamagotchiAvatar } from '../components/tamagotchi/tamagotchi-avatar';
import { Icon } from '../components/ui/icon';
import { buttonStyles } from '@gear-js/ui';
import { useBattleMessage, useInitBattleData } from 'app/hooks/use-battle';
import { StartBattleForm } from 'components/forms/start-battle-form';
import clsx from 'clsx';
import { TamagotchiBattleTopStats } from 'components/tamagotchi/tamagotchi-battle-top-stats';
import { useEffect, useState } from 'react';
import { TamagotchiState } from '../app/types/lessons';
import { useBattle } from '../app/context';
import { useAccount } from '@gear-js/react-hooks';

export const Battle = () => {
  const { account } = useAccount();
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [winner, setWinner] = useState<TamagotchiState>();
  useInitBattleData();
  const { battleState: battle, players: warriors, setBattleState } = useBattle();
  const sendMessage = useBattleMessage();

  const handleAttack = () => {
    const onSuccess = () => console.log('move');
    if (battle?.state === 'GameIsOver')
      sendMessage(
        { StartNewGame: null },
        {
          onSuccess: () => {
            setBattleState(undefined);
            // console.log({ battle, warriors });
          },
        },
      );
    if (battle?.state === 'Moves') sendMessage({ MakeMove: null }, { onSuccess });
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
              <div className="flex gap-10 justify-between grow items-center">
                <TamagotchiBattleTopStats
                  state={battle?.state}
                  isWinner={battle?.winner === battle?.players[0]?.tmgId}
                  health={Math.round(warriors[0].energy / 100)}
                />
                {battle?.state === 'Moves' && (
                  <div className={clsx('flex', battle?.currentTurn === 1 && 'rotate-180')}>
                    <Icon
                      name="battle-next-step"
                      className="w-10 h-20 text-white animate-battle-turn-1 transition-opacity"
                    />
                    <Icon
                      name="battle-next-step"
                      className="w-10 h-20 text-white animate-battle-turn-2 transition-opacity"
                    />
                    <Icon
                      name="battle-next-step"
                      className="w-10 h-20 text-white animate-battle-turn-3 transition-opacity"
                    />
                  </div>
                )}
                <TamagotchiBattleTopStats
                  state={battle?.state}
                  isWinner={battle?.winner === battle?.players[1]?.tmgId}
                  health={Math.round(warriors[1].energy / 100)}
                  isReverse
                />
              </div>
              {/*Avatars*/}
              <div className="relative grow flex gap-10 justify-between items-center mt-15">
                <div className="basis-[445px] flex flex-col">
                  <TamagotchiAvatar
                    hasItem={[]}
                    energy={warriors[1]?.energy}
                    className="min-h-[430px]"
                    isActive={battle?.currentTurn === 0 && battle?.state !== 'GameIsOver'}
                    isWinner={battle?.state === 'GameIsOver' && battle.winner === battle.players[0].tmgId}
                    isDead={battle?.state === 'GameIsOver' && battle.winner !== battle.players[0].tmgId}
                  />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-8">
                  {winner && (
                    <p className="flex flex-col items-center">
                      <strong className="typo-h2 text-primary">{winner.name}</strong>
                      <span className="typo-h1">Win</span>
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
                    )}
                    onClick={handleAttack}>
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
                <div className="basis-[445px] flex flex-col">
                  <TamagotchiAvatar
                    hasItem={[]}
                    energy={warriors[0].energy}
                    className="min-h-[430px]"
                    isActive={battle?.currentTurn === 1 && battle?.state !== 'GameIsOver'}
                    isWinner={battle?.state === 'GameIsOver' && battle.winner === battle.players[1].tmgId}
                    isDead={battle?.state === 'GameIsOver' && battle.winner !== battle.players[1].tmgId}
                  />
                </div>
              </div>
              {/*Info*/}
              <div className="flex gap-10 justify-between grow mt-10">
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
