import React, { useEffect, useRef, useState, VFC } from 'react';
import clsx from 'clsx';
import { Link, Redirect } from 'react-router-dom';
import './ProgramSwitch.scss';
import { routes } from 'routes';
import { GEAR_BALANCE_TRANSFER_VALUE, SWITCH_PAGE_TYPES } from 'consts';
import { useDispatch, useSelector } from 'react-redux';
import { SocketService } from 'services/SocketService';
import { RootState } from 'store/reducers';
import { DropdownMenu } from 'components/blocks/DropdownMenu/DropdownMenu';
import Editor from 'assets/images/editor_icon.svg';

type Props = {
  socketService: SocketService;
  pageType: string;
};

export const ProgramSwitch: VFC<Props> = ({ socketService, pageType }) => {
  const dispatch = useDispatch();

  const [timeInstance, setTimeInstance] = useState(0);
  const [isEditorDropdownOpened, setIsEditorDropdownOpened] = useState(false);
  const [chosenTemplateId, setChosenTemplateId] = useState<number>(-1);

  const { totalIssuance, blocks } = useSelector((state: RootState) => state.blocks);

  const [prevBlockHash, setPrevBlockHash] = useState('');

  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

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

    if (!totalIssuance && socketService) {
      socketService.getTotalIssuance();
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
    socketService,
    totalIssuance,
    isEditorDropdownOpened,
    setIsEditorDropdownOpened,
  ]);

  const handleEditorDropdown = () => {
    if (!isEditorDropdownOpened) {
      setIsEditorDropdownOpened(true);
    }
  };

  const handleTransferBalance = () => {
    socketService.transferBalance({
      value: GEAR_BALANCE_TRANSFER_VALUE,
    });
    console.log(`Transfer succeeded. Value: ${GEAR_BALANCE_TRANSFER_VALUE}`);
  };

  const handleTemplate = (index: number) => {
    setChosenTemplateId(index);
  };

  if (chosenTemplateId > -1) {
    return (
      <Redirect
        to={{
          pathname: routes.editor,
        }}
      />
    );
  }

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
        <div className="switch-block--editor">
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
        </div>
        <div className="switch-block--transfer">
          <button className="switch-block--transfer__btn" type="button" onClick={handleTransferBalance}>
            Make transfer
          </button>
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
            <b className="switch-info__num">{totalIssuance?.totalIssuance.split(' ')[0]}</b>{' '}
            {totalIssuance?.totalIssuance.split(' ')[1]}
          </span>
        </div>
      </div>
    </div>
  );
};
