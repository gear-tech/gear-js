import { GearKeyring } from '@gear-js/api';
import { useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { useChain, useSignAndSend } from '@/hooks';
import { GEAR_BALANCE_TRANSFER_VALUE } from '@/shared/config';

import GiftSVG from '../../assets/gift.svg?react';

function GetTestBalance() {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const { isDevChain, isTestBalanceAvailable } = useChain();
  const alert = useAlert();
  const signAndSend = useSignAndSend();

  const getBalanceFromAlice = async () => {
    if (!isApiReady || !isDevChain) throw new Error('A development node must be selected');
    if (!account) throw new Error('Account is not found');

    const addressOrPair = await GearKeyring.fromSuri('//Alice');
    const extrinsic = api.tx.balances.transferKeepAlive(account.address, GEAR_BALANCE_TRANSFER_VALUE);

    signAndSend(extrinsic, 'Transfer', { addressOrPair });
  };

  if (!isTestBalanceAvailable) return null;

  return (
    <Button
      icon={GiftSVG}
      text="Get Test Balance"
      color="secondary"
      size="small"
      onClick={() => getBalanceFromAlice().catch(({ message }: Error) => alert.error(message))}
      noWrap
    />
  );
}

export { GetTestBalance };
