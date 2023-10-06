import { AddressOrPair } from '@polkadot/api/types';
import { EventRecord } from '@polkadot/types/interfaces';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useApi, useAlert } from '@gear-js/react-hooks';

import { Method } from '@/features/explorer';
import { getExtrinsicFailedMessage } from '@/shared/helpers';

type Options = {
  signSource?: string;
  keepAlive?: boolean;
  onSuccess?: () => void;
};

const useBalanceTransfer = () => {
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const handleEventsStatus = (events: EventRecord[], onSuccess?: () => void) => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));

    events.forEach(({ event }) => {
      const { method, section } = event;

      const alertOptions = { title: `${section}.${method}` };

      if (method === Method.Transfer) {
        alert.success('Balance transfered successfully', alertOptions);

        if (onSuccess) onSuccess();
      } else if (method === Method.ExtrinsicFailed) {
        alert.error(getExtrinsicFailedMessage(api, event), alertOptions);
      }
    });
  };

  const transferBalance = (from: AddressOrPair, to: string, value: string, options?: Options) => {
    try {
      if (!isApiReady) throw new Error('API is not initialized');

      const { signSource, keepAlive, onSuccess } = options || {};

      // TODO: replace to api.balance.transfer after api update to support string value
      const extrinsic = keepAlive ? api.tx.balances.transferKeepAlive(to, value) : api.tx.balances.transfer(to, value);

      if (signSource) {
        web3FromSource(signSource).then(({ signer }) =>
          extrinsic.signAndSend(from, { signer }, ({ events }) => handleEventsStatus(events, onSuccess)),
        );
      } else {
        extrinsic.signAndSend(from, ({ events }) => handleEventsStatus(events, onSuccess));
      }
    } catch (error) {
      const { message } = error as Error;

      alert.error(message);
    }
  };

  return transferBalance;
};

export { useBalanceTransfer };
