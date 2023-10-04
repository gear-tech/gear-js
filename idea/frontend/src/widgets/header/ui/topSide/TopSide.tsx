import BigNumber from 'bignumber.js';
import { useRef, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import clsx from 'clsx';
import { GearKeyring } from '@gear-js/api';
import { useApi, useAlert, useAccount } from '@gear-js/react-hooks';
import { TooltipWrapper, buttonStyles } from '@gear-js/ui';

import { getTestBalance } from 'api';
import { useBalanceMultiplier, useBalanceTransfer, useChain, useModal } from 'hooks';
import { RecentBlocks } from 'features/recentBlocks';
import { HCAPTCHA_SITE_KEY, AnimationTimeout, GEAR_BALANCE_TRANSFER_VALUE } from 'shared/config';
import { ReactComponent as TestBalanceSVG } from 'shared/assets/images/actions/testBalance.svg';
import { ReactComponent as TransferBalanceSVG } from 'shared/assets/images/actions/transferBalance.svg';

import { Wallet } from '../wallet';
import { BalanceInfo } from '../balanceInfo';
import { TotalIssuance } from '../totalIssuance';
import styles from './TopSide.module.scss';

const TopSide = () => {
  const alert = useAlert();

  const { api, isApiReady } = useApi();
  const { account, isAccountReady } = useAccount();
  const { isDevChain, isTestBalanceAvailable } = useChain();
  const { showModal, closeModal } = useModal();
  const { balanceMultiplier } = useBalanceMultiplier();

  const [captchaToken, setCaptchaToken] = useState('');
  const [totalIssuance, setTotalIssuance] = useState('');

  const captchaRef = useRef<HCaptcha>(null);

  const address = account?.address;

  const transferBalance = useBalanceTransfer();

  const getBalanceFromService = () => {
    if (address) getTestBalance({ address, token: captchaToken }).catch(({ message }: Error) => alert.error(message));
  };

  const handleTestBalanceClick = () => {
    if (captchaToken) {
      getBalanceFromService();

      return;
    }

    captchaRef.current?.execute();
  };

  const getBalanceFromAlice = async () => {
    if (!address) return;

    const alice = await GearKeyring.fromSuri('//Alice');

    transferBalance(alice, address, GEAR_BALANCE_TRANSFER_VALUE);
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

  const btnClasses = clsx(buttonStyles.button, buttonStyles.medium, buttonStyles.noText, styles.testBalanceBtn);

  const handleTransferBalanceSubmit = (to: string, value: string) => {
    if (!account || !address) return;

    const { source } = account.meta;

    const unitValue = BigNumber(value).multipliedBy(balanceMultiplier).toFixed();

    transferBalance(address, to, unitValue, { signSource: source, onSuccess: closeModal });
  };

  const openTransferBalanceModal = () => showModal('transferBalance', { onSubmit: handleTransferBalanceSubmit });

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
                {isTestBalanceAvailable && (
                  <TooltipWrapper text="Get test balance">
                    <button
                      type="button"
                      className={btnClasses}
                      onClick={isDevChain ? getBalanceFromAlice : handleTestBalanceClick}>
                      <TestBalanceSVG />
                    </button>
                  </TooltipWrapper>
                )}

                <TooltipWrapper text="Transfer balance">
                  <button type="button" className={btnClasses} onClick={openTransferBalanceModal}>
                    <TransferBalanceSVG />
                  </button>
                </TooltipWrapper>

                <BalanceInfo balance={account.balance} />
              </div>
            </CSSTransition>
          )}

          {isAccountReady && (
            <CSSTransition in appear timeout={AnimationTimeout.Default}>
              <Wallet account={account} />
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
