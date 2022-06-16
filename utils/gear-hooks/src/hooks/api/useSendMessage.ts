import { Hex, Metadata } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import { useContext, useRef } from 'react';
import { AccountContext, AlertContext, ApiContext } from 'context';
import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from 'consts';
import { useConditionalMeta } from './useMetadata';

type SendMessageOptions = {
  value?: string | number;
  onSuccess?: () => void;
};

function useSendMessage(destination: Hex, metaSourceOrData: string | Metadata | undefined) {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);
  const alert = useContext(AlertContext);

  const metadata = useConditionalMeta(metaSourceOrData);

  const title = 'gear.sendMessage';
  const loadingAlertId = useRef('');

  const handleEventsStatus = (events: EventRecord[], onSuccess?: () => void) => {
    events.forEach(({ event: { method, section } }) => {
      if (method === 'MessageEnqueued') {
        alert.success(`${section}.MessageEnqueued`);
        onSuccess && onSuccess();
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

  const sendMessage = (payload: AnyJson, { value = 0, onSuccess }: SendMessageOptions) => {
    if (account && metadata) {
      loadingAlertId.current = alert.loading('Sign In', { title });

      const { address, decodedAddress, meta } = account;
      const { source } = meta;

      api.program.gasSpent
        .handle(decodedAddress, destination, payload, value, metadata)
        .then((gasLimit) => ({ destination, payload, gasLimit, value }))
        .then((message) => api.message.submit(message, metadata) && web3FromSource(source))
        .then(({ signer }) => api.message.signAndSend(address, { signer }, (result) => handleStatus(result, onSuccess)))
        .catch(({ message }: Error) => alert.update(loadingAlertId.current, message, DEFAULT_ERROR_OPTIONS));
    }
  };

  return sendMessage;
}

export { useSendMessage };
