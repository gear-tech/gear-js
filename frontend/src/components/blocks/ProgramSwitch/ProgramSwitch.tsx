import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Link, Redirect } from 'react-router-dom';

import './ProgramSwitch.scss';
import { routes } from 'routes';
import { SWITCH_PAGE_TYPES } from 'consts';
import { useDispatch, useSelector } from 'react-redux';
import { SocketService } from 'services/SocketService';
import { RootState } from 'store/reducers';

import { EditorMenu } from 'components/blocks/EditorMenu';

import Editor from 'images/editor_icon.svg';

type ProgramSwitchType = {
  socketService: SocketService;
  pageType: string;
};

const ProgramSwitch = ({ socketService, pageType }: ProgramSwitchType) => {

  const dispatch = useDispatch();

  const [timeInstance, setTimeInstance] = useState(0)
  const [isSocketsConnected, setIsSocketsConnected] = useState(false);
  const [isEditorDropdownOpened, setIsEditorDropdownOpened] = useState(false);
  const [chosenTemplateId, setChosenTemplateId] = useState<number>(-1);

  const { totalIssuance, blocks } = useSelector((state: RootState) => state.blocks)

  const [prevBlocksLength, setPrevBlocksLength] = useState(0);

  const editorMenuRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {

    const intervalId = setInterval(() => {
      const decreasedTime = timeInstance + 0.1;
      setTimeInstance(decreasedTime);
    }, 100);

    if (blocks.length > prevBlocksLength) {
      setPrevBlocksLength(blocks.length);
      setTimeInstance(0)
    }

    if (!isSocketsConnected && socketService) {
      socketService.getTotalIssuance();
      socketService.subscribeNewBlocks();
      setIsSocketsConnected(true);
    }

    const handleClickOutsideDropdown = (event: MouseEvent) => {
      if (isEditorDropdownOpened && editorMenuRef && !editorMenuRef.current?.contains(event.target as Node)) {
        setIsEditorDropdownOpened(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutsideDropdown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
      clearInterval(intervalId)
    };
  }, [dispatch, 
    setTimeInstance, 
    timeInstance, 
    setIsSocketsConnected, 
    isSocketsConnected, 
    setPrevBlocksLength,
    prevBlocksLength,
    blocks,
    socketService, 
    isEditorDropdownOpened, 
    setIsEditorDropdownOpened])

  const handleEditorDropdown = () => {
    if (!isEditorDropdownOpened) {
      setIsEditorDropdownOpened(true);
    }
  }

  const handleTemplate = (index: number) => {
    setChosenTemplateId(index)
  }

  if (chosenTemplateId > -1) {
    return <Redirect to={{
      pathname: routes.editor,
    }}/>
  }

  return (
    <div className="switch-block">
      <div className="switch-block--wrapper">
        <div className="switch-buttons">
          <Link
            to={routes.main}
            className={clsx('switch-buttons__item', pageType === SWITCH_PAGE_TYPES.UPLOAD_PROGRAM && 'switch-buttons__item--active')}
          >
            Upload program
          </Link>
          <Link
            to={routes.uploadedPrograms}
            className={clsx('switch-buttons__item', pageType === SWITCH_PAGE_TYPES.UPLOADED_PROGRAMS && 'switch-buttons__item--active')}
          >
            Recent uploaded programs
          </Link>
          <Link
            to={routes.allPrograms}
            className={clsx('switch-buttons__item', pageType === SWITCH_PAGE_TYPES.ALL_PROGRAMS && 'switch-buttons__item--active')}
          >
            All programs
          </Link>
        </div>
        <div className="switch-block--editor">
          <button 
            className="switch-block--editor__btn"
            type="button"
            onClick={handleEditorDropdown}
          >
            <img src={Editor} alt="editor-icon"/>
            Write code
          </button>
          {
            isEditorDropdownOpened
            &&
            <EditorMenu editorMenuRef={editorMenuRef} handleTemplate={handleTemplate}/>
          }
        </div>
      </div>
      <div className="switch-block__info switch-info">
        <div className="switch-info__col">
          <span className="switch-info__title">Last block</span>
          <div className="switch-info__data switch-info__timer">
            <div className="switch-info__num">{timeInstance.toFixed(1).slice(0, 1)}</div>
            .
            <div className="switch-info__num">{timeInstance.toFixed(1).slice(-1)}</div> s
          </div>
        </div>
        <div className="switch-info__separator" />
        <div className="switch-info__col">
          <span className="switch-info__title">Total issuance</span>
          <span className="switch-info__data">
            <b className="switch-info__num">{totalIssuance?.totalIssuance.split(" ")[0]}</b> {totalIssuance?.totalIssuance.split(" ")[1]}
          </span>
        </div>
      </div>
    </div>
  )
};

export default ProgramSwitch;
