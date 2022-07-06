import { Hex } from '@gear-js/api';

type CreateFormValues = { buyer: string; seller: string; amount: string };

type Escrow = {
  buyer: Hex;
  seller: Hex;
  state: string;
  amount: string;
};

type EscrowState = { Info: Escrow };

export type { CreateFormValues, Escrow, EscrowState };
