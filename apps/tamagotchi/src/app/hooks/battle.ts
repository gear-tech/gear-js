import { AnyJson } from '@polkadot/types/types';
import { useReadState } from './use-read-state';
import { useBattle } from 'app/context';
import { TamagotchiState } from '../types/lessons';
import { useEffect, useState } from 'react';
import { BattleStateResponse } from '../types/battles';
import { HexString } from '@polkadot/util/types';

const payload = {};

function useReadPlayerState<T>(player?: HexString, payload?: AnyJson) {
  const { metaPlayers } = useBattle();
  return useReadState<T>(player, metaPlayers, payload);
}

export function usePlayersData() {
  const { players } = useBattle();
  const [warriors, setWarriors] = useState<TamagotchiState[]>();
  const { state: p1 } = useReadPlayerState<TamagotchiState>(players[0]?.tmgId, payload);
  const { state: p2 } = useReadPlayerState<TamagotchiState>(players[1]?.tmgId, payload);

  useEffect(() => {
    if (p1 && p2 && players) {
      setWarriors([
        { ...p1, energy: players[0]?.energy, power: players[0]?.power },
        { ...p2, energy: players[1]?.energy, power: players[1]?.power },
      ]);
    } else {
      setWarriors(undefined);
    }
  }, [p1, p2, players]);

  return warriors;
}

function useReadBattleState<T>(payload?: AnyJson) {
  const { battle } = useBattle();
  return useReadState<T>(battle?.programId, battle?.meta, payload);
}

export function useBattleData() {
  const { setPlayers, setBattleState } = useBattle();
  const { state } = useReadBattleState<BattleStateResponse>(payload);

  // console.log({ state });

  useEffect(() => {
    if (state) {
      setPlayers(state.players);
      setBattleState(state);
    }
  }, [state]);

  return { battle: state };
}
