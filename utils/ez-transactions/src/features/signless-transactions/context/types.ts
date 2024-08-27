import { TypeRegistry } from '@polkadot/types';
import { TransactionBuilder } from 'sails-js';
import { IVoucherDetails } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { KeyringPair$Json, KeyringPair } from '@polkadot/keyring/types';

import { UseCreateSessionReturn } from '../hooks';

type Session = {
  key: HexString;
  expires: string;
  allowedActions: string[];
};

type State = {
  SessionForTheAccount: Session | null;
};

type Storage = Record<string, KeyringPair$Json | undefined>;

type SignlessContext = {
  pair: KeyringPair | undefined;
  storagePair: KeyringPair$Json | undefined;
  savePair: (pair: KeyringPair, password: string) => void;
  deletePair: () => void;
  unlockPair: (password: string) => void;
  session: Session | null | undefined;
  isSessionReady: boolean;
  voucherBalance: number;
  createSession: (...args: Parameters<UseCreateSessionReturn['createSession']>) => void;
  deleteSession: (...args: Parameters<UseCreateSessionReturn['deleteSession']>) => void;
  voucher: (IVoucherDetails & { id: HexString }) | undefined;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
  isSessionActive: boolean;
  storageVoucher: (IVoucherDetails & { id: HexString }) | undefined;
  storageVoucherBalance: number;
};

type ActorId = string;

type BaseProgramQueryProps = [originAddress?: ActorId, value?: number | string | bigint, atBlock?: `0x${string}`];

// TODO: infer type from generic
/* eslint-disable  @typescript-eslint/no-explicit-any */
type ActionsForSession = any;

type ProgramSession = {
  key: ActorId;
  expires: number | string | bigint;
  allowed_actions: string[];
};

type SignatureData = {
  key: ActorId;
  duration: number | string | bigint;
  allowed_actions: Array<ActionsForSession>;
};

type BaseProgram =
  | {
      session: {
        sessionForTheAccount: (account: ActorId, ...arg2: BaseProgramQueryProps) => Promise<ProgramSession | null>;
        createSession: (signatureData: SignatureData, signature: `0x${string}` | null) => TransactionBuilder<null>;
        deleteSessionFromAccount: () => TransactionBuilder<null>;
      };
      registry: TypeRegistry;
    }
  | undefined;

export type { State, Session, Storage, SignlessContext, BaseProgram, ProgramSession };
