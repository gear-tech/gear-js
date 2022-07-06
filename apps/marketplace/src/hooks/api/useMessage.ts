import { useAlert } from 'react-alert';
import { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import { EventRecord } from '@polkadot/types/interfaces';
import { useLoading, useAccount, useApi } from 'hooks';
import { Hex, Metadata } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';

function useMessage(destination: Hex, metadata: Metadata | undefined) {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();
  const { enableLoading, disableLoading } = useLoading();

  const handleEventsStatus = (events: EventRecord[]) => {
    events.forEach(({ event: { method } }) => {
      if (method === 'MessageEnqueued') {
        alert.success('Send message: Finalized');
        // onSucessCallback();
      } else if (method === 'ExtrinsicFailed') {
        alert.error('Extrinsic failed');
      }
    });
  };

  const handleStatus = (result: ISubmittableResult) => {
    const { status, events } = result;
    const { isInBlock, isInvalid, isFinalized } = status;

    if (isInvalid) {
      alert.error('Transaction error. Status: isInvalid');
      disableLoading();
    } else if (isInBlock) {
      alert.success('Send message: In block');
    } else if (isFinalized) {
      handleEventsStatus(events);
      disableLoading();
    }
  };

  // TODO: eslint
  // eslint-disable-next-line consistent-return
  const sendMessage = async (payload: AnyJson, value: string | number = 0) => {
    if (account && metadata) {
      enableLoading();

      const { address, decodedAddress, meta } = account;
      const gas = await api.program.calculateGas.handle(decodedAddress, destination, payload, value, false, metadata);
      const gasLimit = gas.min_limit.toNumber();

      const message = { destination, payload, gasLimit, value };
      api.message.submit(message, metadata);

      const { source } = meta;
      const { signer } = await web3FromSource(source);
      return api.message.signAndSend(address, { signer }, handleStatus);
    }
  };

  return sendMessage;
}

export default useMessage;
