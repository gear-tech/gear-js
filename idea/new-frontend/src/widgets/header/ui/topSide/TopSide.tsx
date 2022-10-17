import { useRef, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import clsx from 'clsx';
import { GearKeyring } from '@gear-js/api';
import { useApi, useAlert, Account, useAccount } from '@gear-js/react-hooks';
import { TooltipWrapper, buttonStyles } from '@gear-js/ui';

import { getTestBalance } from 'api';
import { useBalanceTransfer, useChain } from 'hooks';
import { RecentBlocks } from 'features/recentBlocks';
import { HCAPTCHA_SITE_KEY, AnimationTimeout } from 'shared/config';
import { ReactComponent as TestBalanceSVG } from 'shared/assets/images/actions/testBalance.svg';

import styles from './TopSide.module.scss';
import { Wallet } from '../wallet';
import { BalanceInfo } from '../balanceInfo';
import { TotalIssuance } from '../totalIssuance';

type Props = {
  account?: Account;
};

const TopSide = ({ account }: Props) => {
  const alert = useAlert();
  const { api, isApiReady } = useApi();
  const { isAccountReady } = useAccount();
  const { isDevChain } = useChain();

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
    if (captchaToken) {
      handleTransferBalance();

      return;
    }

    captchaRef.current?.execute();
  };

  const handleTransferBalanceFromAlice = async () => {
    if (address) {
      const alice = await GearKeyring.fromSuri('//Alice');

      transferBalance(address, alice);
    }
  };

  const handleExpire = () => setCaptchaToken('');

  useEffect(handleExpire, [address]);

  useEffect(() => {
    if (isApiReady) {
      api.totalIssuance().then((result) => setTotalIssuance(result.slice(0, 5)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, isApiReady]);

  useEffect(() => {
    if (captchaToken) {
      handleTransferBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaToken]);

  const btnClasses = clsx(buttonStyles.button, buttonStyles.medium, buttonStyles.noText, styles.testBalanceBtn);

  return (
    <>
      <div className={styles.topSide}>
        {isApiReady && (
          <CSSTransition in appear timeout={AnimationTimeout.Default}>
            <div className={styles.leftSide}>
              <TotalIssuance totalIssuance={totalIssuance} />
              <RecentBlocks />
            </div>
          </CSSTransition>
        )}
        <div className={styles.rightSide}>
          {account && (
            <CSSTransition in appear timeout={AnimationTimeout.Default}>
              <div className={styles.privateContent}>
                <TooltipWrapper text="Get test balance">
                  <button
                    type="button"
                    className={btnClasses}
                    onClick={isDevChain ? handleTransferBalanceFromAlice : handleTestBalanceClick}>
                    <TestBalanceSVG />
                  </button>
                </TooltipWrapper>
                <BalanceInfo balance={account.balance} />
              </div>
            </CSSTransition>
          )}
          {isAccountReady && (
            <CSSTransition in appear timeout={AnimationTimeout.Default}>
              <Wallet account={account} isApiReady={isApiReady} />
            </CSSTransition>
          )}
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
