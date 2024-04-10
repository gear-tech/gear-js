import { HexString } from '@gear-js/api';
import { useApi, useAccount, useAlert } from '@gear-js/react-hooks';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';

import { Method } from '@/features/explorer';
import { PROGRAM_ERRORS } from '@/shared/config';
import { getExtrinsicFailedMessage } from '@/shared/helpers';
import { SubmittableExtrinsic } from '@polkadot/api/types';

function useIssueVoucher() {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const alert = useAlert();

  const handleEventsStatus = (events: EventRecord[], onSuccess: () => void) => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));

    events.forEach(({ event }) => {
      const { method, section } = event;
      const alertOptions = { title: `${section}.${method}` };

      if (method === Method.ExtrinsicFailed) return alert.error(getExtrinsicFailedMessage(api, event), alertOptions);
      console.log('method: ', method);

      if (method === Method.VoucherIssued) {
        alert.success('Voucher issued', alertOptions);
        onSuccess();
      }
    });
  };

  // TODO: sign transaction helper
  const handleEvents = ({ events, status }: ISubmittableResult, onSuccess: () => void) => {
    if (status.isInBlock) return handleEventsStatus(events, onSuccess);
    if (status.isInvalid) alert.error(PROGRAM_ERRORS.INVALID_TRANSACTION);
  };

  const signAndSend = async (extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>, onSuccess: () => void) => {
    if (!account) throw new Error('Account is not found');

    try {
      const { signer } = await web3FromSource(account.meta.source);

      extrinsic.signAndSend(account.address, { signer }, (events) => handleEvents(events, onSuccess));
    } catch (error) {
      if (error instanceof Error) alert.error(error.message);
    }
  };

  const issueVoucher = async (
    address: HexString,
    programIds: HexString[] | undefined,
    value: string,
    duration: number,
    isCodeUploadEnabled: boolean,
    onSuccess: () => void,
  ) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const { extrinsic } = await api.voucher.issue(address, value, duration, programIds, isCodeUploadEnabled);
    signAndSend(extrinsic, onSuccess);
  };

  const declineVoucher = (id: HexString, onSuccess: () => void) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const extrinsic = api.voucher.decline(id);
    signAndSend(extrinsic, onSuccess);
  };

  const revokeVoucher = (spenderId: HexString, id: HexString, onSuccess: () => void) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const extrinsic = api.voucher.revoke(spenderId, id);
    signAndSend(extrinsic, onSuccess);
  };

  return { issueVoucher, declineVoucher, revokeVoucher };
}

export { useIssueVoucher };
