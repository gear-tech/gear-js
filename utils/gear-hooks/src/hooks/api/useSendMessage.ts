import {
  GasLimit,
  IMessageSendOptions,
  MessageQueued,
  ProgramMetadata,
  VaraMessageSendOptions,
  decodeAddress,
} from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { AnyJson, IKeyringPair, ISubmittableResult } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import BigNumber from 'bignumber.js';
import { useContext } from 'react';
import { AccountContext, AlertContext, ApiContext } from 'context';
import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from 'consts';
import { getExtrinsicFailedMessage } from 'utils';
import { useAccountDeriveBalancesAll } from './balance';
import { useAccountVoucherBalance } from './voucher';

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
  withVoucher?: boolean;
  onSuccess?: (messageId: HexString) => void;
  onInBlock?: (messageId: HexString) => void;
  onError?: () => void;
};

type VaraSendMessageOptions = Omit<SendMessageOptions, 'keepAlive'>;

function useSendMessage(
  destination: HexString,
  metadata: ProgramMetadata | undefined,
  { disableAlerts, disableCheckBalance, pair }: UseSendMessageOptions = {},
) {
  const { api, isApiReady, isVaraVersion } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);
  const alert = useContext(AlertContext);

  const balances = useAccountDeriveBalancesAll();
  const { voucherBalance } = useAccountVoucherBalance(destination);

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

  const isBalanceValid = (gasLimit: string, withVoucher: boolean) => {
    if (disableCheckBalance) return true;
    if (!isApiReady) throw new Error('API is not initialized');
    if (!balances || !voucherBalance) throw new Error('No balance for account');

    const existentialDeposit = api.existentialDeposit.toString();

    const { freeBalance } = balances;
    const balance = (withVoucher ? voucherBalance : freeBalance).toString();

    const valuePerGas = api.valuePerGas.toString();
    const gasLimitValue = BigNumber(gasLimit).multipliedBy(valuePerGas);

    const transactionCost = gasLimitValue.plus(existentialDeposit);

    return BigNumber(balance).isGreaterThanOrEqualTo(transactionCost);
  };

  const sendMessage = async (args: SendMessageOptions | VaraSendMessageOptions) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!account) throw new Error('No account address');
    if (!metadata) throw new Error('Metadata not found');

    const alertId = disableAlerts ? '' : alert.loading('Sign In', { title });

    const { payload, gasLimit, value = 0, withVoucher = false, onSuccess, onInBlock, onError } = args;
    const { address, decodedAddress, meta } = account;
    const { source } = meta;

    if (!isBalanceValid(gasLimit.toString(), withVoucher)) {
      if (onError) onError();

      const message = withVoucher ? 'Low balance on voucher' : 'Low balance on account';

      if (disableAlerts) {
        alert.error(message);
      } else {
        alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);
      }

      return;
    }

    const baseMessage = { destination, payload, gasLimit, value };

    let message: IMessageSendOptions | VaraMessageSendOptions;

    if (isVaraVersion) {
      const _account = pair ? decodeAddress(pair.address) : decodedAddress;

      message = { ...baseMessage, prepaid: withVoucher, account: withVoucher ? _account : undefined };
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
        extrinsic = withVoucher ? api.voucher.call({ SendMessage: sendExtrinsic }) : sendExtrinsic;
      }

      const callback = (result: ISubmittableResult) => handleStatus(result, alertId, onSuccess, onInBlock, onError);

      if (pair) {
        await extrinsic.signAndSend(pair, callback);
      } else {
        const { signer } = await web3FromSource(source);

        await extrinsic.signAndSend(address, { signer }, callback);
      }
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
