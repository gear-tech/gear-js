import { useRef, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { GearKeyring } from '@gear-js/api';
import { useApi, useAlert, Account } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { getTestBalance } from 'api';
import { useBalanceTransfer } from 'hooks';
import { isDevChain } from 'shared/helpers';
import { HCAPTCHA_SITE_KEY, ANIMATION_TIMEOUT } from 'shared/config';
import testBalanceSVG from 'shared/assets/images/actions/testBalance.svg';

import styles from './TopSide.module.scss';
import { Wallet } from '../wallet';
import { RecentBlock } from '../recentBlock';
import { BalanceInfo } from '../balanceInfo';
import { TotalIssuance } from '../totalIssuance';

type Props = {
  account?: Account;
};

const TopSide = ({ account }: Props) => {
  const alert = useAlert();
  const { api } = useApi();

  const captchaRef = useRef<HCaptcha>(null);

  const [captchaToken, setCaptchaToken] = useState('');
  const [totalIssuance, setTotalIssuance] = useState('');

  const address = account?.address;

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

  useEffect(() => handleExpire, [address]);

  useEffect(() => {
    api.totalIssuance().then((result) => setTotalIssuance(result.slice(0, 5)));
  }, [api]);

  useEffect(() => {
    if (captchaToken) {
      handleTransferBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaToken]);

  return (
    <>
      <div className={styles.topSide}>
        <TotalIssuance totalIssuance={totalIssuance} />
        <RecentBlock />
        <div className={styles.rightSide}>
          {account && (
            <CSSTransition in appear timeout={ANIMATION_TIMEOUT}>
              <div className={styles.privateContent}>
                <Button
                  icon={testBalanceSVG}
                  onClick={isDevChain() ? handleTransferBalanceFromAlice : handleTestBalanceClick}
                />
                <BalanceInfo balance={account.balance} />
              </div>
            </CSSTransition>
          )}
          <Wallet account={account} />
        </div>
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
