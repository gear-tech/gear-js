import { GaslessContext } from '@/features/gasless-transactions';
import { SignlessContext } from '@/features/signless-transactions';

type Value = {
  gasless: GaslessContext;
  signless: SignlessContext & {
    onSessionCreate: (signlessAccountAddress: string) => Promise<`0x${string}`>;
  };
};

export type { Value };
