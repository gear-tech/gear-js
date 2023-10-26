import { ProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { useContext } from 'react';
import { AlertContext } from 'context';
import { getAutoGasLimit } from 'utils';
import {
  SendMessageOptions,
  UseSendMessageOptions,
  useHandleCalculateGas,
  useSendMessage,
  VaraSendMessageOptions,
} from '../api';

const MAX_GAS_LIMIT = 250000000000;

function useSendMessageHandler(
  destination: HexString,
  metadata: ProgramMetadata | undefined,
  options?: UseSendMessageOptions & { isMaxGasLimit?: boolean },
) {
  const alert = useContext(AlertContext);
  const calculateGas = useHandleCalculateGas(destination, metadata);
  const sendMessage = useSendMessage(destination, metadata, options);

  return (args: Omit<SendMessageOptions | VaraSendMessageOptions, 'gasLimit'>) => {
    const { payload, value } = args;
    const { isMaxGasLimit = false } = options || {};

    const getGasLimit = isMaxGasLimit
      ? Promise.resolve(MAX_GAS_LIMIT)
      : calculateGas(payload, value).then((result) => getAutoGasLimit(result));

    getGasLimit
      .then((gasLimit) => sendMessage({ ...args, gasLimit }))
      .catch(({ message }: Error) => alert.error(message));
  };
}

export { useSendMessageHandler };
