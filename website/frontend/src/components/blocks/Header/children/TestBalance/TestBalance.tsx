import { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { GearKeyring } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { buttonStyles } from '@gear-js/ui';

import styles from './TestBalance.module.scss';

import { isDevChain } from 'helpers';
import { useBalanceTransfer } from 'hooks';
import { RPC_METHODS, HCAPTCHA_SITE_KEY } from 'consts';
import { Tooltip } from 'components/common/Tooltip';
import ServerRPCRequestService from 'services/ServerRPCRequestService';
import { ReactComponent as TestBalanceSVG } from 'assets/images/testBalance.svg';

type Props = {
  address: string;
};

const TestBalance = ({ address }: Props) => {
  const alert = useAlert();

  const captchaRef = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState('');

  const transferBalance = useBalanceTransfer();

  const handleTransferBalance = async () => {
    try {
      const apiRequest = new ServerRPCRequestService();
      const response = await apiRequest.callRPC(RPC_METHODS.GET_TEST_BALANCE, {
        token: captchaToken,
        address,
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

  return (
    <div>
      <Tooltip content="Get test balance">
        <button
          aria-label="get test balance"
          data-testid="testBalanceBtn"
          className={clsx(buttonStyles.button, buttonStyles.noText, styles.testBalanceBtn)}
          onClick={isDevChain() ? handleTransferBalanceFromAlice : handleTestBalanceClick}
        >
          <TestBalanceSVG className={styles.icon} />
        </button>
      </Tooltip>
      <HCaptcha
        ref={captchaRef}
        size="invisible"
        theme="dark"
        sitekey={HCAPTCHA_SITE_KEY}
        onVerify={setCaptchaToken}
        onExpire={handleExpire}
      />
    </div>
  );
};

export { TestBalance };
