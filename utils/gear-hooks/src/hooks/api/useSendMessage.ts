import { GasLimit, ProgramMetadata } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { useContext } from 'react';
import { AccountContext, AlertContext, ApiContext } from 'context';
import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from 'consts';
import { getExtrinsicFailedMessage } from 'utils';

type UseSendMessageOptions = {
  isMaxGasLimit?: boolean;
  disableAlerts?: boolean;
};

type SendMessageOptions = {
  payload: AnyJson;
  gasLimit: GasLimit;
  value?: string | number;
  prepaid?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
};

function useSendMessage(
  destination: HexString,
  metadata: ProgramMetadata | undefined,
  { disableAlerts }: UseSendMessageOptions = {},
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

  const sendMessage = (args: SendMessageOptions) => {
    if (!account || !metadata) return;

    const alertId = disableAlerts ? '' : alert.loading('Sign In', { title });

    const { payload, gasLimit, value = 0, prepaid = false, onSuccess, onError } = args;
    const { address, decodedAddress, meta } = account;
    const { source } = meta;

    const message = {
      destination,
      payload,
      gasLimit,
      value,
      prepaid,
      account: prepaid ? decodedAddress : undefined,
    };

    api.message
      .send(message, metadata)
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
  };

  return sendMessage;
}

export { useSendMessage, SendMessageOptions, UseSendMessageOptions };
