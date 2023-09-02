import { AddressOrPair } from '@polkadot/api/types';
import { EventRecord } from '@polkadot/types/interfaces';
import { useApi, useAlert } from '@gear-js/react-hooks';

import { Method } from 'features/explorer';
import { getExtrinsicFailedMessage } from 'shared/helpers';
import { web3FromSource } from '@polkadot/extension-dapp';

type Options = {
  signSource?: string;
  onSuccess?: () => void;
};

const useBalanceTransfer = () => {
  const alert = useAlert();
  const { api } = useApi();

  const handleEventsStatus = (events: EventRecord[], onSuccess?: () => void) => {
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

  const transferBalance = (from: AddressOrPair, to: string, value: number, options?: Options) => {
    try {
      const { signSource, onSuccess } = options || {};

      api.balance.transfer(to, value);

      if (signSource) {
        web3FromSource(signSource).then(({ signer }) =>
          api.balance.signAndSend(from, { signer }, ({ events }) => handleEventsStatus(events, onSuccess)),
        );
      } else {
        api.balance.signAndSend(from, ({ events }) => handleEventsStatus(events, onSuccess));
      }
    } catch (error) {
      const { message } = error as Error;

      alert.error(message);
    }
  };

  return transferBalance;
};

export { useBalanceTransfer };
