import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS, useAccount, useAlert } from '@gear-js/react-hooks';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { Event } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { web3FromSource } from '@polkadot/extension-dapp';

import { useExtrinsicFailedMessage } from './use-extrinsic-failed-message';

type Extrinsic = SubmittableExtrinsic<'promise', ISubmittableResult>;

type Options = {
  onSuccess: () => void;
  onError: () => void;
  onFinally: () => void;
};

const DEFAULT_OPTIONS: Options = {
  onSuccess: () => {},
  onError: () => {},
  onFinally: () => {},
} as const;

function useSignAndSend() {
  const { account } = useAccount();
  const alert = useAlert();
  const getExtrinsicFailedMessage = useExtrinsicFailedMessage();

  const handleEvent = (event: Event, method: string, options: Options) => {
    const { onSuccess, onError, onFinally } = options;
    const alertOptions = { title: `${event.section}.${event.method}` };

    if (event.method === 'ExtrinsicFailed') {
      const message = getExtrinsicFailedMessage(event);
      alert.error(message, alertOptions);

      onError();
      onFinally();
      return;
    }

    if (event.method === method) {
      alert.success('Success', alertOptions);

      onSuccess();
      onFinally();
    }
  };

  const handleStatus = ({ events, status }: ISubmittableResult, method: string, options: Options, alertId: string) => {
    const { isInvalid, isReady, isInBlock, isFinalized } = status;
    const { onError, onFinally } = options;

    if (isInvalid) {
      alert.update(alertId, 'Transaction error. Status: isInvalid', DEFAULT_ERROR_OPTIONS);

      onError();
      onFinally();
      return;
    }

    if (isReady) return alert.update(alertId, 'Ready');
    if (isInBlock) return alert.update(alertId, 'InBlock');

    if (isFinalized) {
      alert.update(alertId, 'Finalized', DEFAULT_SUCCESS_OPTIONS);

      events.forEach(({ event }) => handleEvent(event, method, options));
    }
  };

  const signAndSend = (extrinsic: Extrinsic, method: string, options?: Partial<Options>) => {
    if (!account) throw new Error('Account is not found');
    const { address, meta } = account;

    const optionsWithDefaults = { ...DEFAULT_OPTIONS, ...options };
    const { onError, onFinally } = optionsWithDefaults;

    const alertTitle = `${extrinsic.method.section}.${extrinsic.method.method}`;
    const alertId = alert.loading(`SignIn`, { title: alertTitle });

    web3FromSource(meta.source)
      .then(({ signer }) =>
        extrinsic.signAndSend(address, { signer }, (result) =>
          handleStatus(result, method, optionsWithDefaults, alertId),
        ),
      )
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);

        onError();
        onFinally();
      });
  };

  return signAndSend;
}

export { useSignAndSend };
