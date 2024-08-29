import { HexString, decodeAddress } from '@gear-js/api';
import { useAccount, useApi, usePrepareProgramTransaction } from '@gear-js/react-hooks';
import { KeyringPair } from '@polkadot/keyring/types';
import { BaseProgram } from '../context/types';
import { CreeateSessionOptions, Options, Session, useCreateBaseSession } from './use-create-base-session';

function useCreateSailsSession(programId: HexString, program: BaseProgram) {
  const { isApiReady } = useApi();
  const { account } = useAccount();
  const { signAndSendCreateSession, signAndSendDeleteSession, signHex } = useCreateBaseSession(programId);

  const { prepareTransactionAsync: prepareCreateSession } = usePrepareProgramTransaction({
    program,
    serviceName: 'session',
    functionName: 'createSession',
  });

  const { prepareTransactionAsync: prepareDeleteSession } = usePrepareProgramTransaction({
    program,
    serviceName: 'session',
    functionName: 'deleteSessionFromAccount',
  });

  const gasLimit = { increaseGas: 10 };

  const createSession = async (
    session: Session,
    voucherValue: number,
    { shouldIssueVoucher, voucherId, pair, ...options }: Options & CreeateSessionOptions,
  ) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!account) throw new Error('Account not found');
    if (!program) throw new Error('program is undefined');

    const { key, duration, allowedActions: allowed_actions } = session;

    if (voucherId && pair) {
      const hexToSign = program.registry
        .createType('SignatureData', { key: decodeAddress(pair.address), duration, allowed_actions })
        .toHex();

      const { signature } = await signHex(account, hexToSign);

      const { transaction } = await prepareCreateSession({
        account: { addressOrPair: pair },
        args: [{ key, duration, allowed_actions }, signature],
        voucherId,
        gasLimit,
      });

      const { response } = await transaction.signAndSend();

      response()
        .then(() => options.onSuccess())
        .finally(() => options.onFinally());

      return;
    }

    const { transaction } = await prepareCreateSession({
      account: pair ? { addressOrPair: pair.address } : undefined,
      args: [{ key, duration, allowed_actions }, null],
      voucherId,
      gasLimit,
    });
    const messageExtrinsic = transaction.extrinsic;

    signAndSendCreateSession(messageExtrinsic, session, voucherValue, options, shouldIssueVoucher);
  };

  const deleteSession = async (key: HexString, pair: KeyringPair, options: Options) => {
    const { transaction } = await prepareDeleteSession({ args: [], gasLimit });
    signAndSendDeleteSession(transaction.extrinsic, key, pair, options);
  };

  return { createSession, deleteSession };
}

export { useCreateSailsSession };
