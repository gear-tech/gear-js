import { Hex } from '@gear-js/api';

type Player = {
  playerId: Hex;
  balance: string;
};

type Lottery = {
  lotteryOwner: Hex;
  lotteryStartTime: string;
  lotteryDuration: string;
  participationCost: string;
  prizeFund: string;
  players: { [index: number]: Player };
  winner: Hex;
  tokenAddress: Hex;
};

type DashboardProps = {
  startTime: string;
  endTime: string;
  status: string;
  winner: Hex;
  countdown: string;
};

export type { Player, Lottery, DashboardProps };
