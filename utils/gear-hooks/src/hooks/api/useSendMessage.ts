import { GasLimit, IMessageSendOptions, MessageQueued, ProgramMetadata, VaraMessageSendOptions } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
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
  keepAlive?: boolean;
  withVoucher?: boolean;
  onSuccess?: (messageId: HexString) => void;
  onInBlock?: (messageId: HexString) => void;
  onError?: () => void;
};

type VaraSendMessageOptions = Omit<SendMessageOptions, 'keepAlive' | 'withVoucher'> & { prepaid?: boolean };

function useSendMessage(
  destination: HexString,
  metadata: ProgramMetadata | undefined,
  { disableAlerts }: UseSendMessageOptions = {},
) {
  const { api, isApiReady, isVaraVersion } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);
  const alert = useContext(AlertContext);

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

        onSuccess && onSuccess(messageId);
      } else if (method === 'ExtrinsicFailed') {
        const message = getExtrinsicFailedMessage(api, event);

        console.error(message);
        alert.error(message, { title });

        onError && onError();
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

          onInBlock && onInBlock(messageId);
        }
      });
    } else if (isFinalized) {
      if (alertId) alert.update(alertId, 'Finalized', DEFAULT_SUCCESS_OPTIONS);

      handleEventsStatus(events, onSuccess, onError);
    }
  };

  const sendMessage = async (args: SendMessageOptions | VaraSendMessageOptions) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!account) throw new Error('No account address');
    if (!metadata) throw new Error('Metadata not found');

    const alertId = disableAlerts ? '' : alert.loading('Sign In', { title });

    const { payload, gasLimit, value = 0, onSuccess, onInBlock, onError } = args;
    const { address, decodedAddress, meta } = account;
    const { source } = meta;

    const baseMessage = { destination, payload, gasLimit, value };

    let message: IMessageSendOptions | VaraMessageSendOptions;

    if (isVaraVersion) {
      const prepaid = 'prepaid' in args ? args.prepaid : false;
      message = { ...baseMessage, prepaid, account: prepaid ? decodedAddress : undefined };
    } else {
      const keepAlive = 'keepAlive' in args ? args.keepAlive : false;
      message = { ...baseMessage, keepAlive };
    }

    try {
      const sendExtrinsic = api.message.send(message, metadata);
      let extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>;

      if (isVaraVersion) {
        extrinsic = sendExtrinsic;
      } else {
        // TODO: voucher call into standalone hook?
        const withVoucher = 'withVoucher' in args ? args.withVoucher : false;
        extrinsic = withVoucher ? api.voucher.call({ SendMessage: sendExtrinsic }) : sendExtrinsic;
      }

      const { signer } = await web3FromSource(source);

      await extrinsic.signAndSend(address, { signer }, (result) =>
        handleStatus(result, alertId, onSuccess, onInBlock, onError),
      );
    } catch (error) {
      const { message } = error as Error;

      console.error(error);

      if (alertId) {
        alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);
      } else {
        alert.error(message);
      }

      onError && onError();
    }
  };

  return sendMessage;
}

export { useSendMessage, SendMessageOptions, UseSendMessageOptions, VaraSendMessageOptions };
