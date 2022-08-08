import { Hex } from '@gear-js/api';

export enum ProgramState {
  Info = 'Info',
  GetStaker = 'GetStaker',
  GetStakers = 'GetStakers',
}

export type InfoState = {
  Info: {
    admin: Hex;
    timeLeft: string;
  };
};

export type StakerState = {
  Staker: {
    balance: string;
    rewardDebt: string;
    distributed: string;
    rewardAllowed: string;
  };
};

export type StakersState = {
  Stakers: {
    [id: string]: StakerState['Staker'];
  };
};

export type Staker = Record<keyof StakerState['Staker'], number>;
