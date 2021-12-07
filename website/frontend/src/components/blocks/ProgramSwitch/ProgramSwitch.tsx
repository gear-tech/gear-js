import React, { useEffect, useRef, useState, VFC } from 'react';
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
// import { DropdownMenu } from 'components/blocks/DropdownMenu/DropdownMenu';
// import Editor from 'assets/images/editor_icon.svg';

type Props = {
  pageType: string;
};

export const ProgramSwitch: VFC<Props> = ({ pageType }) => {
  const dispatch = useDispatch();
  const currentAccount = useSelector((state: RootState) => state.account.account);
  const apiRequest = new ServerRPCRequestService();

  const [api] = useApi();

  const chain = localStorage.getItem('chain');

  const [timeInstance, setTimeInstance] = useState(0);
  const [isEditorDropdownOpened, setIsEditorDropdownOpened] = useState(false);
  // const [chosenTemplateId, setChosenTemplateId] = useState<number>(-1);

  const { blocks } = useSelector((state: RootState) => state.blocks);
  const [totalIssuance, setTotalIssuance] = useState('');
  const [prevBlockHash, setPrevBlockHash] = useState('');
  const [gasCallCounter, setGasCallCounter] = useState(0);

  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getTotal = async () => {
      if (api) {
        const totalBalance = await api.totalIssuance();
        setTotalIssuance(totalBalance);
      }
    };
    getTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalIssuance]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const decreasedTime = timeInstance + 0.1;
      setTimeInstance(decreasedTime);
    }, 100);

    if (blocks && blocks.length) {
      if (blocks[0].hash !== prevBlockHash) {
        setTimeInstance(0);
      }
      setPrevBlockHash(blocks[0].hash);
    }

    const handleClickOutsideDropdown = (event: MouseEvent) => {
      if (isEditorDropdownOpened && dropdownMenuRef && !dropdownMenuRef.current?.contains(event.target as Node)) {
        setIsEditorDropdownOpened(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDropdown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDropdown);
      clearInterval(intervalId);
    };
  }, [
    dispatch,
    setTimeInstance,
    timeInstance,
    setPrevBlockHash,
    prevBlockHash,
    blocks,
    isEditorDropdownOpened,
    setIsEditorDropdownOpened,
  ]);

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

      const response = await apiRequest.getResource(RPC_METHODS.BALANCE_TRANSFER, {
        publicKey: `${currentAccount.address}`,
        value: GEAR_BALANCE_TRANSFER_VALUE,
      });

      if (response.error) {
        dispatch(AddAlert({ type: EventTypes.ERROR, message: `${response.error.message}` }));
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
            Recent uploaded programs
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
              onClick={chain === 'Development' ? handleTransferBalanceFromAlice : handleTransferBalance}
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
      <div className="switch-block__info switch-info">
        <div className="switch-info__col">
          <span className="switch-info__title">Last block</span>
          <div className="switch-info__data switch-info__timer">
            <div className="switch-info__num">{timeInstance.toFixed(1).slice(0, 1)}</div>.
            <div className="switch-info__num">{timeInstance.toFixed(1).slice(-1)}</div> s
          </div>
        </div>
        <div className="switch-info__separator" />
        <div className="switch-info__col">
          <span className="switch-info__title">Total issuance</span>
          <span className="switch-info__data">
            <b className="switch-info__num">{totalIssuance.slice(0, 5)}</b> Munit
          </span>
        </div>
      </div>
    </div>
  );
};
