import { web3FromSource } from '@polkadot/extension-dapp';
import { useContext } from 'react';
import { AccountContext, AlertContext, ApiContext } from 'context';
import { TransactionName, SingAndSendParams, UploadProgramParams } from './types';
import { waitForProgramInit } from './utils';
import { useHandlers } from './useHandlers';

const useUploadProgram = () => {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);
  const alert = useContext(AlertContext);

  const { handleSignStatus, handleInitStatus, handleError } = useHandlers();

  const signAndSend = (params: SingAndSendParams) => {
    const { address, signer, ...signHandlerParams } = params;

    return api.program.signAndSend(address, { signer }, (result) => handleSignStatus({ result, ...signHandlerParams }));
  };

  const uploadProgram = (params: UploadProgramParams) => {
    if (account) {
      const { program, metadata, payloadType, callbacks } = params;
      const { onFail } = callbacks || {};

      const { meta, address } = account;
      const { source } = meta;

      const { programId } = api.program.upload(program, metadata, payloadType);

      const alertId = alert.loading('SignIn', { title: TransactionName.UploadProgram });
      const initialization = waitForProgramInit(api, programId);

      web3FromSource(source)
        .then(({ signer }) => signAndSend({ address, signer, callbacks, alertId, programId }))
        .then(() => initialization)
        .then((status) => handleInitStatus({ status, programId, onFail }))
        .catch(({ message }: Error) => handleError({ message, alertId, onFail }));
    }
  };

  return uploadProgram;
};

export { useUploadProgram };
