import { TransactionReceipt } from 'ethers';
import { atom, useSetAtom } from 'jotai';

const TransactionTypes = {
  codeValidation: 'code-validation',
  balanceTransfer: 'balance-transfer',
  createProgram: 'create-program',
  executableBalanceTopUp: 'executable-balance-top-up',
  approve: 'approve',
  programMessage: 'program-message',
  programReply: 'program-reply',
  initProgram: 'init-program',
} as const;

type ResultStatus = 'success' | 'error';

// TODO: add receipt to all activities
type BaseActivity = {
  blockNumber?: number;
  blockHash?: string;
  from?: string;
  to?: string | null;
  hash?: string;
  timestamp: number;
  error?: string;
};

type Activity =
  | { type: typeof TransactionTypes.codeValidation; codeId: string; resultStatus: ResultStatus }
  | { type: typeof TransactionTypes.balanceTransfer; value: string; units: string }
  | { type: typeof TransactionTypes.createProgram; programId: string; blockNumber: number }
  | { type: typeof TransactionTypes.executableBalanceTopUp; value: string; programId: string }
  | { type: typeof TransactionTypes.approve; owner: string; spender: string; value: string }
  | {
      type: typeof TransactionTypes.programMessage;
      serviceName: string;
      messageName: string;
      params?: Record<string, unknown>;
      value?: string;
      units?: string;
    }
  | {
      type: typeof TransactionTypes.programReply;
      serviceName: string;
      messageName: string;
      params?: Record<string, unknown>;
      value?: string;
      units?: string;
    }
  | {
      type: typeof TransactionTypes.initProgram;
      programId: string;
      params?: Record<string, unknown>;
      value?: string;
      units?: string;
    };

type MyActivity = Activity & BaseActivity;

const myActivityAtom = atom<MyActivity[]>([]);

const unpackReceipt = (receipt?: TransactionReceipt): BaseActivity => {
  const { blockHash, blockNumber, from, to, hash } = receipt || {};
  return { blockHash, blockNumber, from, to, hash, timestamp: Date.now() };
};

const useAddMyActivity = () => {
  const setMyActivity = useSetAtom(myActivityAtom);

  return (activity: MyActivity) => {
    setMyActivity((prev) => [activity, ...prev]);
  };
};

export { myActivityAtom, useAddMyActivity, TransactionTypes, unpackReceipt, type MyActivity };
