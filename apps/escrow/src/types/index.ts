import { Hex } from '@gear-js/api';

type CreateFormValues = { buyer: string; seller: string; amount: string };

type Escrow = {
  buyer: Hex;
  seller: Hex;
  state: string;
  amount: string;
};

type EscrowState = { Info: Escrow };

type Wallet = [string, Escrow];

type WalletsState = { CreatedWallets: Wallet[] };

export type { CreateFormValues, Escrow, EscrowState, Wallet, WalletsState };
