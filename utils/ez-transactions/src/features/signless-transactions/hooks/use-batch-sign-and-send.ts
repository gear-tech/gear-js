import { useApi, useAccount } from '@gear-js/react-hooks';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { KeyringPair } from '@polkadot/keyring/types';

import { useGetExtrinsicFailedError } from './use-get-extrinsic-failed-error';

type Options = Partial<{
  onSuccess: () => void;
  onError: (error: string) => void;
  onFinally: () => void;
  pair?: KeyringPair;
}>;

function useBatchSignAndSend(type?: 'all' | 'force') {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const { getExtrinsicFailedError } = useGetExtrinsicFailedError();

  const getBatch = () => {
    if (!isApiReady) throw new Error('API is not initialized');

    switch (type) {
      case 'all':
        return api.tx.utility.batchAll;

      case 'force':
        return api.tx.utility.forceBatch;

      default:
        return api.tx.utility.batch;
    }
  };

  const handleStatus = (
    { status, events }: ISubmittableResult,
    { onSuccess = () => {}, onError = () => {}, onFinally = () => {} }: Options = {},
  ) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!status.isInBlock) return;

    events
      .filter(({ event }) => event.section === 'system')
      .forEach(({ event }) => {
        const { method } = event;

        if (method === 'ExtrinsicSuccess' || method === 'ExtrinsicFailed') onFinally();

        if (method === 'ExtrinsicSuccess') return onSuccess();

        if (method === 'ExtrinsicFailed') {
          const message = getExtrinsicFailedError(event);

          onError(message);
          console.error(message);
        }
      });
  };

  const batchSignAndSend = async (
    txs: SubmittableExtrinsic<'promise', ISubmittableResult>[],
    { pair, ...options }: Options = {},
  ) => {
    if (!account) throw new Error('No account address');

    const { address, signer } = account;
    const batch = getBatch();
    const statusCallback = (result: ISubmittableResult) => handleStatus(result, options);

    const signAndSend = pair
      ? batch(txs).signAndSend(pair, statusCallback)
      : batch(txs).signAndSend(address, { signer }, statusCallback);

    signAndSend.catch(({ message }: Error) => {
      const { onError = () => {}, onFinally = () => {} } = options;

      onError(message);
      onFinally();
    });
  };

  const batchSign = async (
    txs: SubmittableExtrinsic<'promise', ISubmittableResult>[],
    { pair, ...options }: Options = {},
  ) => {
    if (!account) throw new Error('No account address');

    const { address, signer } = account;
    const batch = getBatch();

    const signAsync = pair ? batch(txs).signAsync(pair) : batch(txs).signAsync(address, { signer });

    return signAsync.catch(({ message }: Error) => {
      const { onError = () => {}, onFinally = () => {} } = options;

      onError(message);
      onFinally();
    });
  };

  const batchSend = async (txsBatch: SubmittableExtrinsic<'promise', ISubmittableResult>, options: Options = {}) => {
    const statusCallback = (result: ISubmittableResult) => handleStatus(result, options);
    const send = txsBatch.send(statusCallback);

    return send.catch(({ message }: Error) => {
      const { onError = () => {}, onFinally = () => {} } = options;

      onError(message);
      onFinally();
    });
  };

  return { batchSignAndSend, batchSign, batchSend };
}

export { useBatchSignAndSend };
