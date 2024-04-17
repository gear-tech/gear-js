import { ProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { useContext } from 'react';

import { AlertContext, ApiContext } from 'context';
import { getAutoGasLimit } from 'utils';

import { SendMessageOptions, UseSendMessageOptions, useHandleCalculateGas, useSendMessage } from '../api';

type UseSendMessageWithGasOptions = UseSendMessageOptions &
  (
    | {
        isMaxGasLimit?: boolean;
      }
    | {
        gasMultiplier?: number;
      }
  );

type SendMessageWithGasOptions = Omit<SendMessageOptions, 'gasLimit'>;

function useSendMessageWithGas(
  destination: HexString,
  metadata: ProgramMetadata | undefined,
  options: UseSendMessageWithGasOptions = {},
) {
  const { api, isApiReady } = useContext(ApiContext);
  const alert = useContext(AlertContext);

  const calculateGas = useHandleCalculateGas(destination, metadata);
  const sendMessage = useSendMessage(destination, metadata, options);

  return (args: SendMessageWithGasOptions) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const { payload, value, onError = () => {} } = args;
    const isMaxGasLimit = 'isMaxGasLimit' in options ? options.isMaxGasLimit : false;
    const gasMultiplier = 'gasMultiplier' in options ? options.gasMultiplier : undefined;

    const getGasLimit = isMaxGasLimit
      ? Promise.resolve(api.blockGasLimit)
      : calculateGas(payload, value).then((result) => getAutoGasLimit(result, gasMultiplier));

    getGasLimit
      .then((gasLimit) => sendMessage({ ...args, gasLimit }))
      .catch(({ message }: Error) => {
        alert.error(message);
        onError();
      });
  };
}

export { useSendMessageWithGas };
export type { UseSendMessageWithGasOptions, SendMessageWithGasOptions };
