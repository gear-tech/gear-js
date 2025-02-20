import { GearKeyring } from '@gear-js/api';
import { useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRef } from 'react';

import { useChain, useSignAndSend } from '@/hooks';
import { GEAR_BALANCE_TRANSFER_VALUE, HCAPTCHA_SITE_KEY } from '@/shared/config';

import { getTestBalance } from '../../api';
import GiftSVG from '../../assets/gift.svg?react';

function GetTestBalance() {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const { isDevChain, isTestBalanceAvailable } = useChain();
  const alert = useAlert();
  const signAndSend = useSignAndSend();

  const captchaRef = useRef<HCaptcha>(null);

  const getBalance = (token: string) => {
    if (!account) throw new Error('Account is not found');
    const { address } = account;

    getTestBalance({ address, token }).catch(({ message }: Error) => alert.error(message));
  };

  const getBalanceFromAlice = async () => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!account) throw new Error('Account is not found');

    const addressOrPair = await GearKeyring.fromSuri('//Alice');
    const extrinsic = api.tx.balances.transferKeepAlive(account.address, GEAR_BALANCE_TRANSFER_VALUE);

    signAndSend(extrinsic, 'Transfer', { addressOrPair });
  };

  const handleClick = () => (isDevChain ? getBalanceFromAlice() : captchaRef.current?.execute());

  if (!isTestBalanceAvailable) return null;

  return (
    <>
      <Button icon={GiftSVG} text="Get Test Balance" color="secondary" size="small" noWrap onClick={handleClick} />
      <HCaptcha ref={captchaRef} size="invisible" theme="dark" sitekey={HCAPTCHA_SITE_KEY} onVerify={getBalance} />
    </>
  );
}

export { GetTestBalance };
