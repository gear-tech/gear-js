import { HexString } from '@vara-eth/api';
import { atom, useSetAtom } from 'jotai';
import { TransactionReceipt } from 'viem';
import { useConfig } from 'wagmi';
import { getBlockNumber, getBlock } from 'wagmi/actions';

const TransactionTypes = {
  codeValidation: 'code-validation',
  createProgram: 'create-program',
  executableBalanceTopUp: 'executable-balance-top-up',
  approve: 'approve',
  programMessage: 'program-message',
  programReply: 'program-reply',
  initProgram: 'init-program',
  injectedTx: 'injected-tx',
  injectedTxResponse: 'injected-tx-response',
} as const;

type ResultStatus = 'success' | 'error';

type ReceiptActivity = {
  blockHash: HexString;
  blockNumber: bigint;
  from: string;
  to: string | null;
  hash: string;
};

type SendMessageActivity = ReceiptActivity & {
  type: typeof TransactionTypes.programMessage;
  serviceName: string;
  messageName: string;
  params?: Record<string, unknown>;
};

type ReplyActivity = {
  type: typeof TransactionTypes.programReply;
  serviceName: string;
  messageName: string;
  replyCode: string;
  blockNumber: bigint;
  hash: HexString;
  from: HexString;
  value: string;
  params?: Record<string, unknown>;
};

type InjectedTxActivity = {
  type: typeof TransactionTypes.injectedTx;
  serviceName: string;
  messageName: string;
  hash: HexString;
  to: HexString;
  params?: Record<string, unknown>;
};

type InjectedTxResponseActivity = {
  type: typeof TransactionTypes.injectedTxResponse;
  serviceName: string;
  messageName: string;
  replyCode: ResultStatus;
  from: HexString;
  value: string;
  params?: Record<string, unknown>;
};

type ApproveActivity = ReceiptActivity & {
  type: typeof TransactionTypes.approve;
  owner: string;
  spender: string;
  value: string;
};

type UploadCodeActivity = ReceiptActivity & {
  type: typeof TransactionTypes.codeValidation;
  codeId: string;
  resultStatus: ResultStatus;
  error: string | undefined;
};

type CreateProgramActivity = ReceiptActivity & {
  type: typeof TransactionTypes.createProgram;
  programId: string;
};

type ExecutableBalanceTopUpActivity = ReceiptActivity & {
  type: typeof TransactionTypes.executableBalanceTopUp;
  value: string;
  programId: string;
};

type InitProgramActivity = ReceiptActivity & {
  type: typeof TransactionTypes.initProgram;
  programId: string;
  params?: Record<string, unknown>;
};

type MyActivity =
  | UploadCodeActivity
  | CreateProgramActivity
  | ExecutableBalanceTopUpActivity
  | ApproveActivity
  | SendMessageActivity
  | ReplyActivity
  | InitProgramActivity
  | InjectedTxActivity
  | InjectedTxResponseActivity;

type StoredMyActivity = MyActivity & {
  blockNumber: bigint;
  blockHash: HexString;
  timestamp: number;
};

const myActivityAtom = atom<StoredMyActivity[]>([]);

const unpackReceipt = (receipt: TransactionReceipt) => {
  const { blockHash, blockNumber, from, to, transactionHash } = receipt;

  return { blockHash, blockNumber, from, to, hash: transactionHash };
};

const useAddMyActivity = () => {
  const config = useConfig();
  const setMyActivity = useSetAtom(myActivityAtom);

  return async (value: MyActivity) => {
    const activity = { ...value, timestamp: Date.now() } as StoredMyActivity;

    if (!activity.blockNumber && !activity.blockHash) {
      const blockNumber = await getBlockNumber(config);
      const block = await getBlock(config, { blockNumber });

      activity.blockNumber = blockNumber;
      activity.blockHash = block.hash;
    } else if (activity.blockNumber && !activity.blockHash) {
      const block = await getBlock(config, { blockNumber: activity.blockNumber });

      activity.blockHash = block.hash;
    } else if (!activity.blockNumber && activity.blockHash) {
      const block = await getBlock(config, { blockHash: activity.blockHash });

      activity.blockNumber = block.number;
    }

    setMyActivity((prev) => [activity, ...prev]);
  };
};

export { myActivityAtom, useAddMyActivity, TransactionTypes, unpackReceipt, type MyActivity };
