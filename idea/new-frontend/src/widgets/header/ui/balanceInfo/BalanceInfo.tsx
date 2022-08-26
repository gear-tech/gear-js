import { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { GearKeyring } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';

import { getTestBalance } from 'api';
import { useChangeEffect, useBalanceTransfer } from 'hooks';
import { isDevChain } from 'shared/helpers';
import { HCAPTCHA_SITE_KEY } from 'shared/config';

import styles from './BalanceInfo.module.scss';
import headerStyles from '../Header.module.scss';

type Props = {
  unit: string;
  value: string;
  address: string;
};

const BalanceInfo = ({ unit, value, address }: Props) => {
  const alert = useAlert();

  const captchaRef = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState('');

  const transferBalance = useBalanceTransfer();

  const handleTransferBalance = () =>
    getTestBalance({
      token: captchaToken,
      address,
    }).catch((error) => alert.error(error.message));

  const handleTestBalanceClick = () => {
    if (!captchaToken) {
      captchaRef.current?.execute();

      return;
    }

    handleTransferBalance();
  };

  const handleTransferBalanceFromAlice = async () => {
    const alice = await GearKeyring.fromSuri('//Alice');

    transferBalance(address, alice);
  };

  const handleExpire = () => setCaptchaToken('');

  useEffect(() => {
    if (captchaToken) {
      handleTransferBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaToken]);

  useChangeEffect(() => {
    setCaptchaToken('');
  }, [address]);

  return (
    <section>
      <div className={styles.titleWrapper}>
        <h2 className={clsx(headerStyles.title, styles.title)}>Your balance</h2>
        <button
          type="button"
          className={styles.testBalanceBtn}
          onClick={isDevChain() ? handleTransferBalanceFromAlice : handleTestBalanceClick}>
          Get test balance
        </button>
      </div>
      <p className={headerStyles.content}>
        <span className={clsx(headerStyles.value, styles.value)}>{value}</span>
        <span className={styles.unit}>{unit}</span>
      </p>
      <HCaptcha
        ref={captchaRef}
        size="invisible"
        theme="dark"
        sitekey={HCAPTCHA_SITE_KEY}
        onVerify={setCaptchaToken}
        onExpire={handleExpire}
      />
    </section>
  );
};

export { BalanceInfo };
