import { useAlert } from 'react-alert';
import { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import { EventRecord } from '@polkadot/types/interfaces';
import { useLoading, useAccount, useApi } from 'hooks';
import { GearKeyring, Hex, Metadata } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';

function useMessage(destination: Hex, metadata: Metadata | undefined) {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();
  const { enableLoading, disableLoading } = useLoading();

  const handleEventsStatus = (events: EventRecord[]) => {
    events.forEach(({ event: { method } }) => {
      if (method === 'DispatchMessageEnqueued') {
        alert.success('Send message: Finalized');
        // resetValues();
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

  const sendMessage = async (payload: AnyJson, value: string | number = 0) => {
    if (account && metadata) {
      enableLoading();

      const { address, meta } = account;

      const decodedAddress = GearKeyring.decodeAddress(address);
      const gasLimit = await api.program.gasSpent.handle(decodedAddress, destination, payload, value, metadata);

      const message = { destination, payload, gasLimit, value };
      api.message.submit(message, metadata);

      const { source } = meta;
      const { signer } = await web3FromSource(source);
      api.message.signAndSend(address, { signer }, handleStatus);
    }
  };

  return sendMessage;
}

export default useMessage;
