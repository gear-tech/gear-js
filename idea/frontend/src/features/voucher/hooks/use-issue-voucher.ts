import { HexString } from '@gear-js/api';
import { useApi, useAccount, useAlert } from '@gear-js/react-hooks';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';

import { Method } from 'entities/explorer';
import { PROGRAM_ERRORS } from 'shared/config';
import { getExtrinsicFailedMessage } from 'shared/helpers';

function useIssueVoucher() {
  const { api } = useApi();
  const { account } = useAccount();
  const alert = useAlert();

  const handleEventsStatus = (events: EventRecord[]) => {
    events.forEach(({ event }) => {
      const { method, section } = event;
      const alertOptions = { title: `${section}.${method}` };

      if (method === Method.ExtrinsicFailed) return alert.error(getExtrinsicFailedMessage(api, event), alertOptions);
      if (method === Method.VoucherIssued) alert.success('Voucher issued', alertOptions);
    });
  };

  // TODO: sign transaction helper
  const handleEvents = ({ events, status }: ISubmittableResult) => {
    if (status.isInBlock) return handleEventsStatus(events);
    if (status.isInvalid) alert.error(PROGRAM_ERRORS.INVALID_TRANSACTION);
  };

  const issueVoucher = (address: HexString, programId: HexString, value: string) => {
    if (!account) return;

    const { extrinsic } = api.voucher.issue(address, programId, value);

    web3FromSource(account.meta.source)
      .then(({ signer }) => extrinsic.signAndSend(account.address, { signer }, handleEvents))
      .catch(({ message }: Error) => alert.error(message));
  };

  return issueVoucher;
}

export { useIssueVoucher };
