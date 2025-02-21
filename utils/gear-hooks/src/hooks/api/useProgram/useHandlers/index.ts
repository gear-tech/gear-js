import { DEFAULT_ERROR_OPTIONS } from '@/consts';
import { useAlert } from '@/context';
import { HandleInitParams, ProgramStatus, HandleErrorParams } from '../types';
import { useHandleSignStatus } from './useHandleSignStatus';

function useHandlers() {
  const alert = useAlert();

  const handleSignStatus = useHandleSignStatus();

  const handleInitStatus = (params: HandleInitParams) => {
    const { status, programId, onError } = params;

    if (status === ProgramStatus.Failed) {
      alert.error(programId, { title: 'Program initialization' });
      if (onError) onError();
    }
  };

  const handleError = (params: HandleErrorParams) => {
    const { alertId, message, onError } = params;

    alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);
    if (onError) onError();
  };

  return { handleSignStatus, handleInitStatus, handleError };
}

export { useHandlers };
