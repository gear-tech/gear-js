import { useAccount } from '@gear-js/react-hooks';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { Event } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { web3FromSource } from '@polkadot/extension-dapp';

import { useExtrinsicFailedMessage } from './use-extrinsic-failed-message';

type Extrinsic = SubmittableExtrinsic<'promise', ISubmittableResult>;

type Options = {
  onSuccess: () => void;
  onError: (error: string) => void;
  onFinally: () => void;
  onReady: () => void;
  onInBlock: () => void;
};

const DEFAULT_OPTIONS: Options = {
  onSuccess: () => {},
  onError: () => {},
  onFinally: () => {},
  onReady: () => {},
  onInBlock: () => {},
} as const;

function useSignAndSend() {
  const { account } = useAccount();
  const getExtrinsicFailedMessage = useExtrinsicFailedMessage();

  const handleEvent = (event: Event, method: string, options: Options) => {
    const { onSuccess, onFinally } = options;

    if (event.method === 'ExtrinsicFailed') throw new Error(getExtrinsicFailedMessage(event));

    if (event.method === method) {
      onSuccess();
      onFinally();
    }
  };

  const handleStatus = ({ events, status }: ISubmittableResult, method: string, options: Options) => {
    const { isInvalid, isReady, isInBlock, isFinalized } = status;
    const { onReady, onInBlock } = options;

    if (isInvalid) throw new Error('Transaction Error. Status: isInvalid');

    if (isReady) return onReady();
    if (isInBlock) return onInBlock();

    if (isFinalized) events.forEach(({ event }) => handleEvent(event, method, options));
  };

  const signAndSend = async (extrinsic: Extrinsic, method: string, options?: Partial<Options>) => {
    if (!account) throw new Error('Account is not found');

    const optionsWithDefaults = { ...DEFAULT_OPTIONS, ...options };
    const { onError, onFinally } = optionsWithDefaults;

    try {
      const { address, meta } = account;
      const { signer } = await web3FromSource(meta.source);

      // TODO: test errors
      extrinsic.signAndSend(address, { signer }, (result) => handleStatus(result, method, optionsWithDefaults));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      onError(message);
      onFinally();
    }
  };

  return signAndSend;
}

export { useSignAndSend };
