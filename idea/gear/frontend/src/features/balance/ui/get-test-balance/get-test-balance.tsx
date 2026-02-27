import { GearKeyring } from '@gear-js/api';
import { useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useRef, useState } from 'react';

import { useChain, useModalState, useSignAndSend } from '@/hooks';
import { GEAR_BALANCE_TRANSFER_VALUE, TURNSTILE_SITEKEY } from '@/shared/config';
import { cx } from '@/shared/helpers';

import { getTestBalance } from '../../api';
import GiftSVG from '../../assets/gift.svg?react';

import styles from './get-test-balance.module.scss';

function GetTestBalance() {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const { isDevChain, isTestBalanceAvailable } = useChain();
  const alert = useAlert();
  const signAndSend = useSignAndSend();

  const turnstileRef = useRef<TurnstileInstance>(null);

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerificationVisible, openVerification, closeVerification] = useModalState();

  const getBalanceFromAlice = async () => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!account) throw new Error('Account is not found');

    const addressOrPair = await GearKeyring.fromSuri('//Alice');
    const extrinsic = api.tx.balances.transferKeepAlive(account.address, GEAR_BALANCE_TRANSFER_VALUE);

    signAndSend(extrinsic, 'Transfer', { addressOrPair });
  };

  const settleVerification = () => {
    closeVerification();
    setIsVerifying(false);
  };

  const handleVerificationSuccess = (token: string) => {
    if (!account) throw new Error('Account is not found');

    settleVerification();

    const { address } = account;

    getTestBalance({ address, token })
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => turnstileRef.current?.reset());
  };

  const handleVerificationError = (code: string) => {
    settleVerification();

    alert.error(`Error verifying that you are a human, code: ${code}. Please try again.`);
  };

  const handleClick = () => {
    if (isDevChain) return getBalanceFromAlice();

    setIsVerifying(true);
    turnstileRef.current?.execute();
  };

  if (!isTestBalanceAvailable) return null;

  return (
    <>
      <Button
        icon={GiftSVG}
        text="Get Test Balance"
        color="secondary"
        size="small"
        onClick={handleClick}
        disabled={isVerifying}
        noWrap
      />

      <div className={cx(styles.overlay, isVerificationVisible && styles.active)}>
        <Turnstile
          options={{ execution: 'execute', appearance: 'interaction-only' }}
          siteKey={TURNSTILE_SITEKEY}
          ref={turnstileRef}
          onBeforeInteractive={openVerification}
          onAfterInteractive={settleVerification}
          onError={handleVerificationError}
          onSuccess={handleVerificationSuccess}
        />
      </div>
    </>
  );
}

export { GetTestBalance };
