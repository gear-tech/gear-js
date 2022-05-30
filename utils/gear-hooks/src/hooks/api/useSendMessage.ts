import { Hex, Metadata } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import { useContext } from 'react';
import { AccountContext, ApiContext } from 'context';
import { useConditionalMeta } from './useMetadata';

function useSendMessage(destination: Hex, metaSourceOrData: string | Metadata | undefined) {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);
  const metadata = useConditionalMeta(metaSourceOrData);

  const handleEventsStatus = (events: EventRecord[]) => {
    events.forEach(({ event: { method } }) => {
      if (method === 'DispatchMessageEnqueued') {
        // alert.success('Send message: Finalized');
        // onSucessCallback();
      } else if (method === 'ExtrinsicFailed') {
        // alert.error('Extrinsic failed');
      }
    });
  };

  const handleStatus = (result: ISubmittableResult) => {
    const { status, events } = result;
    const { isInBlock, isInvalid, isFinalized } = status;

    if (isInvalid) {
      // alert.error('Transaction error. Status: isInvalid');
      // disableLoading();
    } else if (isInBlock) {
      // alert.success('Send message: In block');
    } else if (isFinalized) {
      handleEventsStatus(events);
      // disableLoading();
    }
  };

  const sendMessage = async (payload: AnyJson, value: string | number = 0) => {
    if (account && metadata) {
      // enableLoading();

      const { address, decodedAddress, meta } = account;
      const gasLimit = await api.program.gasSpent.handle(decodedAddress, destination, payload, value, metadata);

      const message = { destination, payload, gasLimit, value };
      api.message.submit(message, metadata);

      const { source } = meta;
      const { signer } = await web3FromSource(source);
      return api.message.signAndSend(address, { signer }, handleStatus);
    }
  };

  return sendMessage;
}

export { useSendMessage };
