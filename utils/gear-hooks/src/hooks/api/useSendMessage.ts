import { ProgramMetadata } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { useContext } from 'react';
import { AccountContext, AlertContext, ApiContext } from 'context';
import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from 'consts';
import { getAutoGasLimit, getExtrinsicFailedMessage } from 'utils';

type UseSendMessageOptions = {
  isMaxGasLimit?: boolean;
  disableAlerts?: boolean;
};

type SendMessageOptions = {
  value?: string | number;
  prepaid?: boolean;
  isOtherPanicsAllowed?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
};

const MAX_GAS_LIMIT = 250000000000;

function useSendMessage(
  destination: HexString,
  metadata: ProgramMetadata | undefined,
  { isMaxGasLimit = false, disableAlerts }: UseSendMessageOptions = {},
) {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);
  const alert = useContext(AlertContext);

  const title = 'gear.sendMessage';

  const handleEventsStatus = (events: EventRecord[], onSuccess?: () => void, onError?: () => void) => {
    events.forEach(({ event }) => {
      const { method, section } = event;

      if (method === 'MessageQueued') {
        if (!disableAlerts) alert.success(`${section}.MessageQueued`);

        onSuccess && onSuccess();
      } else if (method === 'ExtrinsicFailed') {
        const message = getExtrinsicFailedMessage(api, event);

        console.error(message);
        alert.error(message, { title });

        onError && onError();
      }
    });
  };

  const handleStatus = (result: ISubmittableResult, alertId: string, onSuccess?: () => void, onError?: () => void) => {
    const { status, events } = result;
    const { isReady, isInBlock, isInvalid, isFinalized } = status;

    if (isInvalid) {
      if (alertId) {
        alert.update(alertId, 'Transaction error. Status: isInvalid', DEFAULT_ERROR_OPTIONS);
      } else {
        alert.error('Transaction error. Status: isInvalid');
      }
    } else if (isReady && alertId) {
      alert.update(alertId, 'Ready');
    } else if (isInBlock && alertId) {
      alert.update(alertId, 'In Block');
    } else if (isFinalized) {
      if (alertId) alert.update(alertId, 'Finalized', DEFAULT_SUCCESS_OPTIONS);

      handleEventsStatus(events, onSuccess, onError);
    }
  };

  const sendMessage = (payload: AnyJson, options?: SendMessageOptions) => {
    if (account && metadata) {
      const alertId = disableAlerts ? '' : alert.loading('Sign In', { title });

      const { value = 0, isOtherPanicsAllowed = false, prepaid = false, onSuccess, onError } = options || {};
      const { address, decodedAddress, meta } = account;
      const { source } = meta;

      const getGasLimit = isMaxGasLimit
        ? Promise.resolve(MAX_GAS_LIMIT)
        : api.program.calculateGas
            .handle(decodedAddress, destination, payload, value, isOtherPanicsAllowed, metadata)
            .then(getAutoGasLimit);

      getGasLimit
        .then((gasLimit) => ({
          destination,
          gasLimit,
          payload,
          value,
          prepaid,
          account: prepaid ? decodedAddress : undefined,
        }))
        .then((message) => api.message.send(message, metadata))
        .then(() => web3FromSource(source))
        .then(({ signer }) =>
          api.message.signAndSend(address, { signer }, (result) => handleStatus(result, alertId, onSuccess, onError)),
        )
        .catch((error: Error) => {
          const { message } = error;

          console.error(error);

          if (alertId) {
            alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);
          } else {
            alert.error(message);
          }

          onError && onError();
        });
    }
  };

  return sendMessage;
}

export { useSendMessage, SendMessageOptions, UseSendMessageOptions };
