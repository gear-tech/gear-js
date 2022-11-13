import { Hex, Metadata } from '@gear-js/api';
import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS, useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import { useRef } from 'react';

type SendMessageOptions = {
  value?: string | number;
  isOtherPanicsAllowed?: boolean;
  onSuccess?: () => void;
};

function useSendMessage(destination: Hex, metadata: Metadata | undefined) {
  const { api } = useApi();
  const { account } = useAccount();
  const alert = useAlert();

  const title = 'gear.sendMessage';
  const loadingAlertId = useRef('');

  const handleEventsStatus = (events: EventRecord[], onSuccess?: () => void) => {
    events.forEach(({ event: { method, section } }) => {
      if (method === 'MessageEnqueued') {
        alert.success(`${section}.MessageEnqueued`);

        if (onSuccess) onSuccess();
      } else if (method === 'ExtrinsicFailed') {
        alert.error('Extrinsic Failed', { title });
      }
    });
  };

  const handleStatus = (result: ISubmittableResult, onSuccess?: () => void) => {
    const { status, events } = result;
    const { isReady, isInBlock, isInvalid, isFinalized } = status;

    if (isInvalid) {
      alert.update(loadingAlertId.current, 'Transaction error. Status: isInvalid', DEFAULT_ERROR_OPTIONS);
    } else if (isReady) {
      alert.update(loadingAlertId.current, 'Ready');
    } else if (isInBlock) {
      alert.update(loadingAlertId.current, 'In Block');
    } else if (isFinalized) {
      alert.update(loadingAlertId.current, 'Finalized', DEFAULT_SUCCESS_OPTIONS);
      handleEventsStatus(events, onSuccess);
    }
  };

  const sendMessage = (payload: AnyJson, options?: SendMessageOptions) => {
    if (account && metadata) {
      loadingAlertId.current = alert.loading('Sign In', { title });

      const { value = 0, onSuccess } = options || {};
      const { address, meta } = account;
      const { source } = meta;

      const message = { gasLimit: 250000000000, destination, payload, value };

      api.message.send(message, metadata);

      web3FromSource(source)
        .then(({ signer }) => api.message.signAndSend(address, { signer }, (result) => handleStatus(result, onSuccess)))
        .catch((error: Error) => alert.update(loadingAlertId.current, error.message, DEFAULT_ERROR_OPTIONS));
    }
  };

  return sendMessage;
}

export { useSendMessage };
