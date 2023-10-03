import { EventRecord } from '@polkadot/types/interfaces';
import { HexString } from '@polkadot/util/types';
import { useContext } from 'react';
import { DEFAULT_SUCCESS_OPTIONS, DEFAULT_ERROR_OPTIONS } from 'consts';
import { AlertContext, ApiContext } from 'context';
import { getExtrinsicFailedMessage } from 'utils';
import { Callbacks, Method, HandleSignStatusParams, TransactionStatus, ProgramError } from '../types';

function useHandleSignStatus() {
  const { api, isApiReady } = useContext(ApiContext); // сircular dependency fix
  const alert = useContext(AlertContext);

  const handleEventsStatus = (events: EventRecord[], programId: HexString, callbacks?: Callbacks) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const { onError, onSuccess } = callbacks || {};

    events.forEach(({ event }) => {
      const { method, section } = event;
      const alertOptions = { title: `${section}.${method}` };

      if (method === Method.ExtrinsicFailed) {
        alert.error(getExtrinsicFailedMessage(api, event), alertOptions);
        if (onError) onError();
      } else if (method === Method.MessageQueued) {
        alert.success('Success', alertOptions);
        if (onSuccess) onSuccess(programId);
      }
    });
  };

  const handleSignStatus = (params: HandleSignStatusParams) => {
    const { result, alertId, callbacks, programId } = params;
    const { onError } = callbacks || {};

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

      if (onError) onError();
    }
  };

  return handleSignStatus;
}

export { useHandleSignStatus };
