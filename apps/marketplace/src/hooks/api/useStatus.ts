import { EventRecord } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { useLoading } from 'hooks/context';
import { useAlert } from 'react-alert';

function useStatus() {
  const alert = useAlert();
  const { disableLoading } = useLoading();

  const handleEventsStatus = (events: EventRecord[]) => {
    events.forEach(({ event: { method } }) => {
      if (method === 'DispatchMessageEnqueued') {
        alert.success('Send message: Finalized');
        // resetValues();
      } else if (method === 'ExtrinsicFailed') {
        alert.info('Extrinsic failed');
      }
    });
  };

  const handleStatus = (result: ISubmittableResult) => {
    const { status, events } = result;
    const { isInBlock, isInvalid, isFinalized } = status;

    if (isInvalid) {
      alert.info('Transaction error. Status: isInvalid');
      disableLoading();
    } else if (isInBlock) {
      alert.success('Send message: In block');
    } else if (isFinalized) {
      handleEventsStatus(events);
      disableLoading();
    }
  };

  return handleStatus;
}

export default useStatus;
