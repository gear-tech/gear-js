import { HexString } from '@gear-js/api';
import { useApi, useAccount, useAlert } from '@gear-js/react-hooks';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';

import { Method } from '@/features/explorer';
import { PROGRAM_ERRORS } from '@/shared/config';
import { getExtrinsicFailedMessage } from '@/shared/helpers';

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

  const issueVoucher = async (
    address: HexString,
    programId: HexString,
    value: string,
    duration: number,
    isCodeUploadEnabled: boolean,
    onSuccess: () => void,
  ) => {
    if (!isApiReady || !account) return;

    try {
      const programs = [programId];

      const { extrinsic } = await api.voucher.issue(address, value, duration, programs, isCodeUploadEnabled);

      const { signer } = await web3FromSource(account.meta.source);

      extrinsic.signAndSend(account.address, { signer }, (events) => handleEvents(events, onSuccess));
    } catch (error) {
      if (error instanceof Error) alert.error(error.message);
    }
  };

  const issueVoucherDeprecated = async (
    address: HexString,
    programId: HexString,
    value: string,
    onSuccess: () => void,
  ) => {
    if (!isApiReady || !account) return;

    try {
      const { extrinsic } = api.voucher.issueDeprecated(address, programId, value);

      const { signer } = await web3FromSource(account.meta.source);

      extrinsic.signAndSend(account.address, { signer }, (events) => handleEvents(events, onSuccess));
    } catch (error) {
      if (error instanceof Error) alert.error(error.message);
    }
  };

  return { issueVoucher, issueVoucherDeprecated };
}

export { useIssueVoucher };
