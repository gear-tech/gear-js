import { useContext } from 'react';
import { DEFAULT_ERROR_OPTIONS } from 'consts';
import { AlertContext } from 'context';
import { HandleInitParams, ProgramStatus, HandleErrorParams } from '../types';
import { useHandleSignStatus } from './useHandleSignStatus';

function useHandlers() {
  const alert = useContext(AlertContext); // сircular dependency fix

  const handleSignStatus = useHandleSignStatus();

  const handleInitStatus = (params: HandleInitParams) => {
    const { status, programId, onFail } = params;

    if (status === ProgramStatus.Failed) {
      alert.error(programId, { title: 'Program initialization' });
      if (onFail) onFail();
    }
  };

  const handleError = (params: HandleErrorParams) => {
    const { alertId, message, onFail } = params;

    alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);
    if (onFail) onFail();
  };

  return { handleSignStatus, handleInitStatus, handleError };
}

export { useHandlers };
