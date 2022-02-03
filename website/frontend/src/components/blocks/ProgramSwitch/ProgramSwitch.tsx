import React, { useState, VFC } from 'react';
import clsx from 'clsx';
import { Link /* , Redirect */ } from 'react-router-dom';
import './ProgramSwitch.scss';
import { routes } from 'routes';
import { AddAlert } from 'store/actions/actions';
import { EventTypes } from 'types/events';
import { GEAR_BALANCE_TRANSFER_VALUE, SWITCH_PAGE_TYPES, RPC_METHODS } from 'consts';
import { useDispatch, useSelector } from 'react-redux';
import ServerRPCRequestService from 'services/ServerRPCRequestService';
import { RootState } from 'store/reducers';
import { useApi } from '../../../hooks/useApi';
import { isDevChain } from 'helpers';
import { BlocksSummary } from 'components/BlocksSummary/BlocksSummary';
// import { DropdownMenu } from 'components/blocks/DropdownMenu/DropdownMenu';
// import Editor from 'assets/images/editor_icon.svg';

type Props = {
  pageType: string;
};

export const ProgramSwitch: VFC<Props> = ({ pageType }) => {
  const [api] = useApi();
  const dispatch = useDispatch();
  const currentAccount = useSelector((state: RootState) => state.account.account);
  const apiRequest = new ServerRPCRequestService();

  // const [chosenTemplateId, setChosenTemplateId] = useState<number>(-1);

  const [gasCallCounter, setGasCallCounter] = useState(0);

  // const handleEditorDropdown = () => {
  //   if (!isEditorDropdownOpened) {
  //     setIsEditorDropdownOpened(true);
  //   }
  // };

  const handleTransferBalance = async () => {
    try {
      if (!currentAccount) {
        throw new Error(`WALLET NOT CONNECTED`);
      }

      const response = await apiRequest.getResource(RPC_METHODS.GET_TEST_BALANCE, {
        address: `${currentAccount.address}`,
      });

      if (response.error) {
        dispatch(AddAlert({ type: EventTypes.ERROR, message: `${response.error.error}` }));
      }

      // count the number of crane calls
      setGasCallCounter(gasCallCounter + 1);
    } catch (error) {
      dispatch(AddAlert({ type: EventTypes.ERROR, message: `${error}` }));
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
      dispatch(AddAlert({ type: EventTypes.ERROR, message: `${error}` }));
    }
  };

  // const handleTemplate = (index: number) => {
  //   setChosenTemplateId(index);
  // };

  // if (chosenTemplateId > -1) {
  //   return (
  //     <Redirect
  //       to={{
  //         pathname: routes.editor,
  //       }}
  //     />
  //   );
  // }

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
        {/* <div className="switch-block--editor">
          <button
            className={clsx('switch-block--editor__btn', isEditorDropdownOpened && 'is-active')}
            type="button"
            onClick={handleEditorDropdown}
          >
            <img src={Editor} alt="editor-icon" />
            Write code
          </button>
          {isEditorDropdownOpened && (
            <DropdownMenu dropdownMenuRef={dropdownMenuRef} handleDropdownBtnClick={handleTemplate} />
          )}
        </div> */}
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
