import { HexString } from '@polkadot/util/types';

export type BattlePlayer = {
  attributes: number[];
  energy: number;
  owner: HexString;
  power: number;
  tmgId: HexString;
};

export type BattleStatesList = 'Registration' | 'Moves' | 'Waiting' | 'GameIsOver';

export type BattleStateResponse = {
  currentTurn: number;
  players: Array<BattlePlayer>;
  state: BattleStatesList;
  steps: number;
  tmgStoreId: HexString;
  winner: HexString;
};
