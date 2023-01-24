import { Hex } from '@gear-js/api';

type Player = {
  playerId: Hex;
  balance: string;
};

type Lottery = {
  admin: Hex;
  started: string;
  ended: string;
  participationCost: string;
  prizeFund: string;
  players: Player[];
  winner: Hex;
  fungibleToken: Hex | null;
};

type DashboardProps = {
  startTime: string;
  endTime: string;
  status: string;
  winner: Hex;
  countdown: string;
};

export type { Player, Lottery, DashboardProps };
