import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import { getProgramMetadata, ProgramMetadata } from '@gear-js/api';
import { getLessonAssets } from '../utils/get-lesson-assets';
import { useMetadata } from '../hooks/use-metadata';
import metaFight from '../../assets/meta/meta-battle.txt';
import { ENV } from '../consts';
import { BattlePlayer, BattleStateResponse } from '../types/battles';
import { HexString } from '@polkadot/util/types';

type BattleType = {
  programId: HexString;
  meta: ProgramMetadata;
};

type Program = {
  battle?: BattleType;
  battleState?: BattleStateResponse;
  setBattleState: Dispatch<SetStateAction<BattleStateResponse | undefined>>;
  players: BattlePlayer[];
  setPlayers: Dispatch<SetStateAction<BattlePlayer[]>>;
  metaPlayers?: ProgramMetadata;
  reset: () => void;
};

export const BattleCtx = createContext({} as Program);

const useProgram = (): Program => {
  const [players, setPlayers] = useState<BattlePlayer[]>([]);
  const [metaPlayers, setMetaPlayers] = useState<ProgramMetadata>();
  const [battle, setBattle] = useState<BattleType>({} as BattleType);
  const [battleState, setBattleState] = useState<BattleStateResponse>();
  const isParsed = useRef(false);

  const { metadata: mBattle } = useMetadata(metaFight);

  useEffect(() => {
    if (mBattle) {
      setBattle({
        programId: ENV.battle,
        meta: mBattle,
      });
    }
  }, [mBattle]);

  const reset = () => {
    setPlayers([]);
  };

  useEffect(() => {
    const ls = localStorage.getItem('tmgBattle');
    if (ls) {
      setPlayers(JSON.parse(ls));
      isParsed.current = true;
    }
  }, []);

  useEffect(() => {
    if (players) {
      console.log('set');
      localStorage.setItem('tmgBattle', JSON.stringify(players));

      fetch(getLessonAssets(6))
        .then((res) => res.text() as Promise<string>)
        .then((raw) => getProgramMetadata(`0x${raw}`))
        .then((meta) => setMetaPlayers(meta));
    } else if (isParsed.current) {
      localStorage.removeItem('tmgBattle');
    }
  }, [players]);

  return {
    battle,
    battleState,
    setBattleState,
    players,
    setPlayers,
    metaPlayers,
    reset,
  };
};

export function BattleProvider({ children }: { children: ReactNode }) {
  const { Provider } = BattleCtx;
  return <Provider value={useProgram()}>{children}</Provider>;
}
