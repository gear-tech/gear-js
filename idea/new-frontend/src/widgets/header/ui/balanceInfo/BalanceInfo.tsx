import { useRef, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import clsx from 'clsx';
import { GearKeyring } from '@gear-js/api';
import { useAlert, Account } from '@gear-js/react-hooks';

import { getTestBalance } from 'api';
import { useBalanceTransfer } from 'hooks';
import { isDevChain } from 'shared/helpers';
import { ANIMATION_TIMEOUT, HCAPTCHA_SITE_KEY } from 'shared/config';

import styles from './BalanceInfo.module.scss';
import headerStyles from '../Header.module.scss';

type Props = {
  account: Account;
};

const BalanceInfo = ({ account }: Props) => {
  const alert = useAlert();

  const captchaRef = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState('');

  const { address, balance } = account;

  const transferBalance = useBalanceTransfer();

  const handleTransferBalance = () => {
    if (address) {
      getTestBalance({
        token: captchaToken,
        address,
      }).catch((error) => alert.error(error.message));
    }
  };

  const handleTestBalanceClick = () => {
    if (!captchaToken) {
      captchaRef.current?.execute();

      return;
    }

    handleTransferBalance();
  };

  const handleTransferBalanceFromAlice = async () => {
    if (address) {
      const alice = await GearKeyring.fromSuri('//Alice');

      transferBalance(address, alice);
    }
  };

  const handleExpire = () => setCaptchaToken('');

  useEffect(() => {
    if (captchaToken) {
      handleTransferBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaToken]);

  useEffect(() => handleExpire, [address]);

  const { unit = 'Unit', value } = balance;

  return (
    <>
      <CSSTransition in appear timeout={ANIMATION_TIMEOUT}>
        <section className={styles.balanceSection}>
          <div className={styles.titleWrapper}>
            <h2 className={clsx(headerStyles.title, styles.title)}>Balance</h2>
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
        </section>
      </CSSTransition>
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

export { BalanceInfo };
