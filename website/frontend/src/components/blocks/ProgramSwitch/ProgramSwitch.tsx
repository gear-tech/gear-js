import React, { useState, VFC } from 'react';
import { useAlert } from 'react-alert';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import './ProgramSwitch.scss';
import { routes } from 'routes';
import { GEAR_BALANCE_TRANSFER_VALUE, SWITCH_PAGE_TYPES, RPC_METHODS } from 'consts';
import ServerRPCRequestService from 'services/ServerRPCRequestService';
import { useAccount, useApi } from 'hooks';
import { isDevChain } from 'helpers';
import { BlocksSummary } from 'components/BlocksSummary/BlocksSummary';

type Props = {
  pageType: string;
};

export const ProgramSwitch: VFC<Props> = ({ pageType }) => {
  const { api } = useApi();
  const alert = useAlert();
  const { account: currentAccount } = useAccount();
  const apiRequest = new ServerRPCRequestService();
  const [gasCallCounter, setGasCallCounter] = useState(0);

  const handleTransferBalance = async () => {
    try {
      if (!currentAccount) {
        throw new Error(`WALLET NOT CONNECTED`);
      }

      const response = await apiRequest.callRPC(RPC_METHODS.GET_TEST_BALANCE, {
        address: `${currentAccount.address}`,
      });

      if (response.error) {
        alert.error(`${response.error.message}`);
      }

      // count the number of crane calls
      setGasCallCounter(gasCallCounter + 1);
    } catch (error) {
      alert.error(`${error}`);
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
        <div className="switch-block--transfer">
          {gasCallCounter <= 3 ? (
            <button
              className="switch-block--transfer__btn"
              type="button"
              onClick={isDevChain() ? handleTransferBalanceFromAlice : handleTransferBalance}
            >
              Get test balance
            </button>
          ) : (
            <button className="switch-block--transfer__btn" type="button" disabled>
              Don&apos;t be greedy :)
            </button>
          )}
        </div>
      </div>
      <BlocksSummary />
    </div>
  );
};
