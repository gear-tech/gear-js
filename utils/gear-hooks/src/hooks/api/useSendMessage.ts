import { ProgramMetadata } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { useContext, useRef } from 'react';
import { AccountContext, AlertContext, ApiContext } from 'context';
import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from 'consts';
import { getAutoGasLimit } from 'utils';

type SendMessageOptions = {
  value?: string | number;
  isOtherPanicsAllowed?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
};

function useSendMessage(destination: HexString, metadata: ProgramMetadata | undefined) {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);
  const alert = useContext(AlertContext);

  const title = 'gear.sendMessage';
  const loadingAlertId = useRef('');

  const handleEventsStatus = (events: EventRecord[], onSuccess?: () => void, onError?: () => void) => {
    events.forEach(({ event: { method, section } }) => {
      if (method === 'MessageQueued') {
        alert.success(`${section}.MessageQueued`);
        onSuccess && onSuccess();
      } else if (method === 'ExtrinsicFailed') {
        alert.error('Extrinsic Failed', { title });
        onError && onError();
      }
    });
  };

  const handleStatus = (result: ISubmittableResult, onSuccess?: () => void, onError?: () => void) => {
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
      handleEventsStatus(events, onSuccess, onError);
    }
  };

  const sendMessage = (payload: AnyJson, options?: SendMessageOptions) => {
    if (account && metadata) {
      loadingAlertId.current = alert.loading('Sign In', { title });

      const { value = 0, isOtherPanicsAllowed = false, onSuccess, onError } = options || {};
      const { address, decodedAddress, meta } = account;
      const { source } = meta;

      api.program.calculateGas
        .handle(decodedAddress, destination, payload, value, isOtherPanicsAllowed, metadata)
        .then(getAutoGasLimit)
        .then((gasLimit) => ({ destination, gasLimit, payload, value }))
        .then((message) => api.message.send(message, metadata) && web3FromSource(source))
        .then(({ signer }) =>
          api.message.signAndSend(address, { signer }, (result) => handleStatus(result, onSuccess, onError)),
        )
        .catch(({ message }: Error) => {
          alert.update(loadingAlertId.current, message, DEFAULT_ERROR_OPTIONS);
          onError && onError();
        });
    }
  };

  return sendMessage;
}

export { useSendMessage };
