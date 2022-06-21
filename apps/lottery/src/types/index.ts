import { Hex } from '@gear-js/api';

type Player = {
  playerId: Hex;
  balance: string;
};

type Lottery = {
  lotteryOwner: Hex;
  lotteryStarted: boolean;
  lotteryStartTime: string;
  lotteryDuration: string;
  participationCost: string;
  prizeFund: string;
  players: { [index: number]: Player };
};

export type { Player, Lottery };
