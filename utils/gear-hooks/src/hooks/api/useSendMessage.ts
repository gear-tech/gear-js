import { GasLimit, MessageQueued, ProgramMetadata } from '@gear-js/api';
import { EventRecord } from '@polkadot/types/interfaces';
import { AnyJson, IKeyringPair, ISubmittableResult } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@/consts';
import { useAccount, useAlert, useApi } from '@/context';
import { getExtrinsicFailedMessage } from '@/utils';

type UseSendMessageOptions = {
  disableAlerts?: boolean;
  disableCheckBalance?: boolean;
  pair?: IKeyringPair;
};

type SendMessageOptions = {
  payload: AnyJson;
  gasLimit: GasLimit;
  value?: string | number;
  keepAlive?: boolean;
  voucherId?: HexString;
  onSuccess?: (messageId: HexString) => void;
  onInBlock?: (messageId: HexString) => void;
  onError?: () => void;
};

function useSendMessage(
  destination: HexString,
  metadata: ProgramMetadata | undefined,
  { disableAlerts, pair }: UseSendMessageOptions = {},
) {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const alert = useAlert();

  const title = 'gear.sendMessage';

  const handleEventsStatus = (
    events: EventRecord[],
    onSuccess?: (messageId: HexString) => void,
    onError?: () => void,
  ) => {
    if (!isApiReady) throw new Error('API is not initialized');

    events.forEach(({ event }) => {
      const { method, section } = event;

      if (method === 'MessageQueued') {
        if (!disableAlerts) alert.success(`${section}.MessageQueued`);

        const messageId = (event as MessageQueued).data.id.toHex();

        if (onSuccess) onSuccess(messageId);
      } else if (method === 'ExtrinsicFailed') {
        const message = getExtrinsicFailedMessage(api, event);

        console.error(message);
        alert.error(message, { title });

        if (onError) onError();
      }
    });
  };

  const handleStatus = (
    result: ISubmittableResult,
    alertId: string,
    onSuccess?: (messageId: HexString) => void,
    onInBlock?: (messageId: HexString) => void,
    onError?: () => void,
  ) => {
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
    } else if (isInBlock) {
      if (alertId) alert.update(alertId, 'In Block');

      events.forEach(({ event }) => {
        if (event.method === 'MessageQueued') {
          const messageId = (event as MessageQueued).data.id.toHex();

          if (onInBlock) onInBlock(messageId);
        }
      });
    } else if (isFinalized) {
      if (alertId) alert.update(alertId, 'Finalized', DEFAULT_SUCCESS_OPTIONS);

      handleEventsStatus(events, onSuccess, onError);
    }
  };

  const sendMessage = async (args: SendMessageOptions) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!account) throw new Error('No account address');
    if (!metadata) throw new Error('Metadata not found');

    const alertId = disableAlerts ? '' : alert.loading('Sign In', { title });

    const { payload, gasLimit, value = 0, voucherId, onSuccess, onInBlock, onError } = args;
    const { address, signer } = account;

    const baseMessage = { destination, payload, gasLimit, value };

    const keepAlive = 'keepAlive' in args ? args.keepAlive : false;
    const message = { ...baseMessage, keepAlive };

    try {
      const sendExtrinsic = api.message.send(message, metadata);
      const extrinsic = voucherId ? api.voucher.call(voucherId, { SendMessage: sendExtrinsic }) : sendExtrinsic;

      const callback = (result: ISubmittableResult) => handleStatus(result, alertId, onSuccess, onInBlock, onError);

      if (pair) {
        await extrinsic.signAndSend(pair, callback);
      } else {
        await extrinsic.signAndSend(address, { signer }, callback);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;

      console.error(error);

      if (alertId) {
        alert.update(alertId, errorMessage, DEFAULT_ERROR_OPTIONS);
      } else {
        alert.error(errorMessage);
      }

      if (onError) onError();
    }
  };

  return sendMessage;
}

export { useSendMessage };
export type { SendMessageOptions, UseSendMessageOptions };
