import { Hex } from '@gear-js/api';
import { EventRecord } from '@polkadot/types/interfaces';
import { useContext } from 'react';
import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from 'consts';
import { AlertContext, ApiContext } from 'context';
import { Callbacks, Method, HandleSignStatusParams, TransactionStatus, ProgramError } from '../types';
import { getExtrinsicFailedMessage } from '../utils';

function useHandleSignStatus() {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const alert = useContext(AlertContext);

  const handleEventsStatus = (events: EventRecord[], programId: Hex, callbacks?: Callbacks) => {
    const { onFail, onSuccess } = callbacks || {};

    events.forEach(({ event }) => {
      const { method, section } = event;
      const alertOptions = { title: `${section}.${method}` };

      if (method === Method.ExtrinsicFailed) {
        alert.error(getExtrinsicFailedMessage(api, event), alertOptions);
        if (onFail) onFail();
      } else if (method === Method.MessageEnqueued) {
        alert.success('Success', alertOptions);
        if (onSuccess) onSuccess(programId);
      }
    });
  };

  const handleSignStatus = (params: HandleSignStatusParams) => {
    const { result, alertId, callbacks, programId } = params;
    const { onFail } = callbacks || {};

    const { status, events } = result;
    const { isReady, isInBlock, isFinalized, isInvalid } = status;

    if (isReady) {
      alert.update(alertId, TransactionStatus.Ready);
    } else if (isInBlock) {
      alert.update(alertId, TransactionStatus.InBlock);
    } else if (isFinalized) {
      alert.update(alertId, TransactionStatus.Finalized, DEFAULT_SUCCESS_OPTIONS);
      handleEventsStatus(events, programId, callbacks);
    } else if (isInvalid) {
      alert.update(alertId, ProgramError.InvalidTransaction, DEFAULT_ERROR_OPTIONS);

      if (onFail) onFail();
    }
  };

  return handleSignStatus;
}

export { useHandleSignStatus };
