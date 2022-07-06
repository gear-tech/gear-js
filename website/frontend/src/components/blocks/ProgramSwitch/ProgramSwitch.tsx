import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { GearKeyring } from '@gear-js/api';
import { useAccount, useApi, useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import styles from './ProgramSwitch.module.scss';

import { routes } from 'routes';
import { isDevChain } from 'helpers';
import { transferBalance } from 'services/ApiService';
import { RPC_METHODS, HCAPTCHA_SITE_KEY } from 'consts';
import { BlocksSummary } from 'components/BlocksSummary/BlocksSummary';
import ServerRPCRequestService from 'services/ServerRPCRequestService';

const ProgramSwitch = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();

  const captchaRef = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState('');

  const handleTransferBalance = async () => {
    try {
      if (!account) {
        throw new Error('Wallet not connected');
      }

      const apiRequest = new ServerRPCRequestService();
      const response = await apiRequest.callRPC(RPC_METHODS.GET_TEST_BALANCE, {
        token: captchaToken,
        address: account.address,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
    }
  };

  const handleTestBalanceClick = () => {
    if (captchaToken) {
      handleTransferBalance();
    } else {
      captchaRef.current?.execute();
    }
  };

  const handleTransferBalanceFromAlice = async () => {
    try {
      if (!account) {
        throw new Error('Wallet not connected');
      }

      if (api) {
        const alice = await GearKeyring.fromSuri('//Alice');

        transferBalance(api, account.address, alice, alert);
      }
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
    }
  };

  useEffect(() => {
    if (captchaToken) {
      handleTransferBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaToken]);

  return (
    <div className={styles.programSwitch}>
      <div className={styles.switchWrapper}>
        <div className={styles.switchButtons}>
          <NavLink to={routes.main} className={styles.switchButton}>
            Upload program
          </NavLink>
          <NavLink to={routes.uploadedPrograms} className={styles.switchButton}>
            My programs
          </NavLink>
          <NavLink to={routes.allPrograms} className={styles.switchButton}>
            All programs
          </NavLink>
          <NavLink to={routes.messages} className={styles.switchButton}>
            Messages
          </NavLink>
        </div>
        {account && (
          <>
            <Button
              text="Get test balance"
              className={styles.testBalanceButton}
              onClick={isDevChain() ? handleTransferBalanceFromAlice : handleTestBalanceClick}
            />
            <HCaptcha
              sitekey={HCAPTCHA_SITE_KEY}
              onVerify={setCaptchaToken}
              onExpire={() => setCaptchaToken('')}
              ref={captchaRef}
              theme="dark"
              size="invisible"
            />
          </>
        )}
      </div>
      <BlocksSummary />
    </div>
  );
};

export { ProgramSwitch };
