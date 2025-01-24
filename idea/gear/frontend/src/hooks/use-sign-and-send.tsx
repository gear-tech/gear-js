import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS, useAccount, useAlert } from '@gear-js/react-hooks';
import { AddressOrPair, SubmittableExtrinsic } from '@polkadot/api/types';
import { Event } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { ReactNode } from 'react';

import { getErrorMessage } from '@/shared/helpers';

import { useExtrinsicFailedMessage } from './use-extrinsic-failed-message';

type Extrinsic = SubmittableExtrinsic<'promise', ISubmittableResult>;

type Options = {
  successAlert: ReactNode;
  addressOrPair?: AddressOrPair;
  onSuccess: () => void;
  onError: () => void;
  onFinally: () => void;
  onFinalized: (value: ISubmittableResult) => void;
};

const DEFAULT_OPTIONS = {
  successAlert: 'Success',
  addressOrPair: undefined,
  onSuccess: () => {},
  onError: () => {},
  onFinally: () => {},
  onFinalized: () => {},
} as const;

function useSignAndSend() {
  const { account } = useAccount();
  const alert = useAlert();
  const getExtrinsicFailedMessage = useExtrinsicFailedMessage();

  const handleEvent = (event: Event, method: string, options: Options) => {
    const { successAlert, onSuccess, onError, onFinally } = options;
    const alertOptions = { title: `${event.section}.${event.method}` };

    if (event.method === 'ExtrinsicFailed') {
      const message = getExtrinsicFailedMessage(event);
      alert.error(message, alertOptions);

      onError();
      onFinally();
      return;
    }

    if (event.method === method) {
      alert.success(successAlert, alertOptions);

      onSuccess();
      onFinally();
    }
  };

  const handleStatus = (result: ISubmittableResult, method: string, options: Options, alertId: string) => {
    const { events, status } = result;
    const { isInvalid, isReady, isInBlock, isFinalized } = status;
    const { onError, onFinally, onFinalized } = options;

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

      onFinalized(result);

      events.forEach(({ event }) => handleEvent(event, method, options));
    }
  };

  return (extrinsic: Extrinsic, method: string, options?: Partial<Options>) => {
    if (!account) throw new Error('Account is not found');
    const { address, signer } = account;

    const optionsWithDefaults = { ...DEFAULT_OPTIONS, ...options };
    const { onError, onFinally, addressOrPair } = optionsWithDefaults;

    const alertTitle = `${extrinsic.method.section}.${extrinsic.method.method}`;
    const alertId = alert.loading(`SignIn`, { title: alertTitle });

    const statusCallback = (result: ISubmittableResult) => handleStatus(result, method, optionsWithDefaults, alertId);

    const signAndSend = () =>
      addressOrPair
        ? extrinsic.signAndSend(addressOrPair, statusCallback)
        : extrinsic.signAndSend(address, { signer }, statusCallback);

    signAndSend().catch((error) => {
      alert.update(alertId, getErrorMessage(error), DEFAULT_ERROR_OPTIONS);

      onError();
      onFinally();
    });
  };
}

export { useSignAndSend };
