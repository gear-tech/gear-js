import { HexString } from '@polkadot/util/types';
import { TamagotchiState } from './lessons';

export type BattlePlayerResponse = {
  attributes: number[];
  energy: number;
  owner: HexString;
  power: number;
  tmgId: HexString;
};

export type TamagotchiBattlePlayer = TamagotchiState & {
  attributes: number[];
  energy: number;
  owner: HexString;
  power: number;
  tmgId: HexString;
};

export type BattleStatesList = 'Registration' | 'Moves' | 'Waiting' | 'GameIsOver';

export type BattleStateResponse = {
  currentTurn: number;
  players: BattlePlayerResponse[];
  state: BattleStatesList;
  steps: number;
  tmgStoreId: HexString;
  winner: HexString;
};
