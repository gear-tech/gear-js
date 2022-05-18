import React, { useEffect, useRef, useState, VFC } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Button } from '@gear-js/ui';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import './ProgramSwitch.scss';
import { routes } from 'routes';
import { GEAR_BALANCE_TRANSFER_VALUE, SWITCH_PAGE_TYPES, RPC_METHODS, HCAPTCHA_SITE_KEY } from 'consts';
import ServerRPCRequestService from 'services/ServerRPCRequestService';
import { useAccount, useApi, useAlert } from 'hooks';
import { isDevChain } from 'helpers';
import { BlocksSummary } from 'components/BlocksSummary/BlocksSummary';

type Props = {
  pageType: string;
};

export const ProgramSwitch: VFC<Props> = ({ pageType }) => {
  const { api } = useApi();
  const alert = useAlert();
  const { account: currentAccount } = useAccount();

  const [captchaToken, setCaptchaToken] = useState('');
  const captchaRef = useRef<HCaptcha>(null);

  const handleTransferBalance = async () => {
    try {
      if (!currentAccount) {
        throw new Error(`WALLET NOT CONNECTED`);
      }

      const apiRequest = new ServerRPCRequestService();
      const response = await apiRequest.callRPC(RPC_METHODS.GET_TEST_BALANCE, {
        address: `${currentAccount.address}`,
        token: captchaToken,
      });

      if (response.error) {
        alert.error(`${response.error.message}`);
      }
    } catch (error) {
      alert.error(`${error}`);
    }
  };

  useEffect(() => {
    if (captchaToken) {
      handleTransferBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaToken]);

  const handleTestBalanceClick = () => {
    if (captchaToken) {
      handleTransferBalance();
    } else {
      captchaRef.current?.execute();
    }
  };

  const handleTransferBalanceFromAlice = () => {
    try {
      if (!currentAccount) {
        throw new Error(`WALLET NOT CONNECTED`);
      }

      if (api) {
        api.balance.transferFromAlice(currentAccount.address, GEAR_BALANCE_TRANSFER_VALUE);
      }
    } catch (error) {
      alert.error(`${error}`);
    }
  };

  return (
    <div className="switch-block">
      <div className="switch-block--wrapper">
        <div className="switch-buttons">
          <Link
            to={routes.main}
            className={clsx(
              'switch-buttons__item',
              pageType === SWITCH_PAGE_TYPES.UPLOAD_PROGRAM && 'switch-buttons__item--active'
            )}
          >
            Upload program
          </Link>
          <Link
            to={routes.uploadedPrograms}
            className={clsx(
              'switch-buttons__item',
              pageType === SWITCH_PAGE_TYPES.UPLOADED_PROGRAMS && 'switch-buttons__item--active'
            )}
          >
            My programs
          </Link>
          <Link
            to={routes.allPrograms}
            className={clsx(
              'switch-buttons__item',
              pageType === SWITCH_PAGE_TYPES.ALL_PROGRAMS && 'switch-buttons__item--active'
            )}
          >
            All programs
          </Link>
          <Link
            to={routes.messages}
            className={clsx(
              'switch-buttons__item',
              pageType === SWITCH_PAGE_TYPES.ALL_MESSAGES && 'switch-buttons__item--active'
            )}
          >
            Messages
          </Link>
        </div>
        {currentAccount && (
          <>
            <Button
              className="test-balance-button"
              text="Get test balance"
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
