import { useRef, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { GearKeyring } from '@gear-js/api';
import { useApi, useAlert, useAccount } from '@gear-js/react-hooks';

import { getTestBalance } from '@/api';
import { useChain, useSignAndSend } from '@/hooks';
import { RecentBlocks } from '@/features/recentBlocks';
import { HCAPTCHA_SITE_KEY, AnimationTimeout, GEAR_BALANCE_TRANSFER_VALUE } from '@/shared/config';
import { Wallet } from '@/features/wallet';

import { TotalIssuance } from '../totalIssuance';
import styles from './TopSide.module.scss';

const TopSide = () => {
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const { account } = useAccount();
  const address = account?.address;

  const { isDevChain, isTestBalanceAvailable } = useChain();
  const signAndSend = useSignAndSend();

  const [captchaToken, setCaptchaToken] = useState('');
  const [totalIssuance, setTotalIssuance] = useState('');

  const captchaRef = useRef<HCaptcha>(null);

  const getBalanceFromService = () => {
    if (!address) throw new Error('Account is not found');

    getTestBalance({ address, token: captchaToken }).catch(({ message }: Error) => alert.error(message));
  };

  const handleTestBalanceClick = () => (captchaToken ? getBalanceFromService() : captchaRef.current?.execute());

  const getBalanceFromAlice = async () => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!address) throw new Error('Account is not found');

    const alicePair = await GearKeyring.fromSuri('//Alice');
    const extrinsic = api.tx.balances.transferKeepAlive(address, GEAR_BALANCE_TRANSFER_VALUE);

    signAndSend(extrinsic, 'Transfer', { addressOrPair: alicePair });
  };

  const handleExpire = () => setCaptchaToken('');

  useEffect(handleExpire, [address]);

  useEffect(() => {
    if (!isApiReady) return;

    api.totalIssuance().then((result) => setTotalIssuance(result.slice(0, 5)));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady]);

  useEffect(() => {
    if (captchaToken) getBalanceFromService();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaToken]);

  return (
    <>
      <div className={styles.container}>
        {isApiReady && (
          <CSSTransition in appear timeout={AnimationTimeout.Default}>
            <div className={styles.main}>
              <TotalIssuance totalIssuance={totalIssuance} />
              <RecentBlocks />
            </div>
          </CSSTransition>
        )}

        <Wallet />
      </div>

      <HCaptcha
        ref={captchaRef}
        size="invisible"
        theme="dark"
        sitekey={HCAPTCHA_SITE_KEY}
        onVerify={setCaptchaToken}
        onExpire={handleExpire}
      />
    </>
  );
};

export { TopSide };
