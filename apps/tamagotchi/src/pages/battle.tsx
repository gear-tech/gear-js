import { BattleCharacterCard } from '../components/common/battle-character-card';
import { CharacterAvatar } from '../components/common/character-avatar';
import { Icon } from '../components/ui/icon';
import { buttonStyles } from '@gear-js/ui';
import { useBattleData, usePlayersData } from '../app/hooks/battle';
import { StartBattleForm } from 'components/forms/start-battle-form';
import clsx from 'clsx';
import { useBattleMessage } from '../app/hooks/use-battle-message';
import { BattleTamagotchiTopStats } from 'components/tamagotchi/battle-tamagotchi-top-stats';
import { useEffect, useState } from 'react';
import { TamagotchiState } from '../app/types/lessons';

export const Battle = () => {
  const [winner, setWinner] = useState<TamagotchiState>();
  const { battle } = useBattleData();
  const warriors = usePlayersData();
  const sendMessage = useBattleMessage();

  const handleAttack = () => {
    const onSuccess = () => console.log('success');
    if (battle?.state === 'GameIsOver') sendMessage({ StartNewGame: null }, { onSuccess });
    if (battle?.state === 'Moves') sendMessage({ MakeMove: null }, { onSuccess });
  };

  useEffect(() => {
    if (battle?.state === 'GameIsOver' && warriors) {
      setWinner(warriors[battle.players.findIndex((p) => p.tmgId === battle.winner)]);
    }
    console.log({ battle });
  }, [battle, warriors]);

  return (
    <>
      {battle && warriors && warriors?.length > 0 ? (
        <>
          {/*Top*/}
          <div className="flex gap-10 justify-between grow items-center">
            <BattleTamagotchiTopStats
              state={battle.state}
              isWinner={battle.winner === battle.players[0].tmgId}
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
            <BattleTamagotchiTopStats
              state={battle.state}
              isWinner={battle.winner === battle.players[1].tmgId}
              health={Math.round(warriors[1].energy / 100)}
              isReverse
            />
          </div>
          {/*Avatars*/}
          <div className="relative grow flex gap-10 justify-between items-center mt-15">
            <div className="basis-[445px] flex flex-col">
              <CharacterAvatar
                lesson={6}
                hasItem={[]}
                energy={warriors[0].energy}
                className="min-h-[430px]"
                isActive={battle?.currentTurn === 0 && battle?.state !== 'GameIsOver'}
                isWinner={battle?.state === 'GameIsOver' && battle.winner === battle.players[0].tmgId}
                state={
                  battle?.state === 'GameIsOver'
                    ? battle.winner === battle.players[0].tmgId
                      ? 'normal'
                      : 'dead'
                    : 'normal'
                }
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-8">
              {winner && (
                <p className="flex flex-col items-center">
                  <strong className="typo-h2 text-[#2BD071]">{winner.name}</strong>
                  <span className="typo-h1">Win</span>
                </p>
              )}

              <button
                className={clsx(
                  'btn items-center gap-2 min-w-[250px]',
                  battle?.state === 'Moves'
                    ? 'bg-[#F24A4A] text-white hover:bg-red-600 transition-colors'
                    : battle?.state === 'GameIsOver'
                    ? buttonStyles.secondary
                    : buttonStyles.primary,
                )}
                onClick={handleAttack}>
                <Icon name="swords" className="w-5 h-5" />{' '}
                {battle?.state === 'Moves'
                  ? 'Attack'
                  : battle?.state === 'Registration'
                  ? 'Fight'
                  : battle?.state === 'GameIsOver'
                  ? 'Start New Game'
                  : ''}
              </button>
            </div>
            <div className="basis-[445px] flex flex-col">
              <CharacterAvatar
                lesson={6}
                hasItem={[]}
                energy={warriors[1].energy}
                className="min-h-[430px]"
                isActive={battle?.currentTurn === 1 && battle?.state !== 'GameIsOver'}
                isWinner={battle?.state === 'GameIsOver' && battle.winner === battle.players[1].tmgId}
                state={
                  battle?.state === 'GameIsOver'
                    ? battle.winner === battle.players[1].tmgId
                      ? 'normal'
                      : 'dead'
                    : 'normal'
                }
              />
            </div>
          </div>
          {/*Info*/}
          <div className="flex gap-10 justify-between grow mt-10">
            <div className="basis-[445px] flex flex-col">
              <BattleCharacterCard tamagotchi={warriors[0]} />
            </div>
            <div className="basis-[445px] flex flex-col">
              <BattleCharacterCard tamagotchi={warriors[1]} />
            </div>
          </div>
        </>
      ) : (
        <StartBattleForm />
      )}
    </>
  );
};
