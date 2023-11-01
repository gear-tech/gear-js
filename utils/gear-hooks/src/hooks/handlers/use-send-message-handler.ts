import { ProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { useContext } from 'react';
import { AlertContext, ApiContext } from 'context';
import { getAutoGasLimit } from 'utils';
import {
  SendMessageOptions,
  UseSendMessageOptions,
  useHandleCalculateGas,
  useSendMessage,
  VaraSendMessageOptions,
} from '../api';

function useSendMessageHandler(
  destination: HexString,
  metadata: ProgramMetadata | undefined,
  options?: UseSendMessageOptions & { isMaxGasLimit?: boolean },
) {
  const { api, isApiReady } = useContext(ApiContext);
  const alert = useContext(AlertContext);

  const calculateGas = useHandleCalculateGas(destination, metadata);
  const sendMessage = useSendMessage(destination, metadata, options);

  return (args: Omit<SendMessageOptions, 'gasLimit'> | Omit<VaraSendMessageOptions, 'gasLimit'>) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const { payload, value } = args;
    const { isMaxGasLimit = false } = options || {};

    const getGasLimit = isMaxGasLimit
      ? Promise.resolve(api.blockGasLimit)
      : calculateGas(payload, value).then((result) => getAutoGasLimit(result));

    getGasLimit
      .then((gasLimit) => sendMessage({ ...args, gasLimit }))
      .catch(({ message }: Error) => alert.error(message));
  };
}

export { useSendMessageHandler };
