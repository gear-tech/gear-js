import { AnyJson } from '@polkadot/types/types';
import { HexString, ProgramMetadata } from '@gear-js/api';
import {
  SendMessageOptions,
  UseSendMessageOptions,
  useAccount,
  useSendMessage,
  useSendMessageWithGas,
} from '@gear-js/react-hooks';

import { useSignlessTransactions } from '../context';

type Payload = Record<string, Record<string, AnyJson>>;
type SendSignlessMessageOptions = Omit<SendMessageOptions, 'payload'> & { payload: Payload };

const getSinglessPayload = (payload: Payload, sessionForAccount: HexString | null | undefined) => {
  const [entry] = Object.entries(payload);
  const [key, value] = entry;

  return { ...payload, [key]: { ...value, sessionForAccount } };
};

function useSignlessSendMessage(
  destination: HexString,
  metadata: ProgramMetadata | undefined,
  options?: UseSendMessageOptions,
) {
  const { account } = useAccount();
  const { pair, voucher } = useSignlessTransactions();
  const sendMessage = useSendMessage(destination, metadata, { ...options, pair });

  const sendSignlessMessage = (args: SendSignlessMessageOptions) => {
    const sessionForAccount = pair ? account?.decodedAddress : null;
    const payload = getSinglessPayload(args.payload, sessionForAccount);
    const voucherId = voucher?.id || args.voucherId;

    sendMessage({ ...args, payload, voucherId });
  };

  return sendSignlessMessage;
}

function useSignlessSendMessageHandler(
  destination: HexString,
  metadata: ProgramMetadata | undefined,
  options?: UseSendMessageOptions & { isMaxGasLimit?: boolean },
) {
  const { account } = useAccount();
  const { pair, voucher } = useSignlessTransactions();
  const sendMessage = useSendMessageWithGas(destination, metadata, { ...options, pair });

  const sendSignlessMessage = (args: Omit<SendSignlessMessageOptions, 'gasLimit'>) => {
    const sessionForAccount = pair ? account?.decodedAddress : null;
    const payload = getSinglessPayload(args.payload, sessionForAccount);
    const voucherId = voucher?.id || args.voucherId;

    sendMessage({ ...args, payload, voucherId });
  };

  return sendSignlessMessage;
}

export { useSignlessSendMessage, useSignlessSendMessageHandler };
export type { SendSignlessMessageOptions };
