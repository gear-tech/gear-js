import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProgramAction, getProgramsAction, sendMessageResetAction } from 'store/actions/actions';
import { RootState } from 'store/reducers';

import { fileNameHandler } from 'helpers';

import { Message } from 'components/Message';
import { SocketService } from 'services/SocketService';

import RefreshIllustration from 'images/refresh.svg';
import MessageIllustration from 'images/message.svg';

import './BlocksList.scss';

type Props = {
  socketService: SocketService
}

type ProgramMessageType = {
  programName: string;
  programHash: string;
}

export const BlocksListUploaded = ({ socketService }: Props) => {

  const dispatch = useDispatch();

  const { programs } = useSelector((state: RootState) => state.programs)

  const [isProgramsReq, setIsProgramsReq] = useState(false);

  const [programMessage, setProgramMessage] = useState<ProgramMessageType | null>(null);

  const formatProgramDate = (rawDate: string) => {
    const date = new Date(rawDate);
    const programTime = date.toLocaleTimeString('en-GB');
    const programDate = date.toLocaleDateString('en-US').replaceAll('/', '-')
    return `${programDate} ${programTime}`;
  }

  const handleRefreshProgram = (programHash: string) => {
    dispatch(getProgramAction(programHash))
  }

  const handleSendMessage = (programHash: string, programName: string) => {
    setProgramMessage({
      programHash,
      programName
    })
  }

  const handleCloseMessageForm = () => {
    dispatch(sendMessageResetAction())
    setProgramMessage(null);
  }

  useEffect(() => {
    if (!isProgramsReq) {
      dispatch(getProgramsAction());
      setIsProgramsReq(true)
    }
  }, [dispatch, setIsProgramsReq, isProgramsReq])

  if (programMessage) {
    return (
      <Message programHash={programMessage.programHash} programName={programMessage.programName} socketService={socketService} handleClose={handleCloseMessageForm}/>
    )
  }

  return (
    <div className="block-list">
      {
        programs && programs.length 
        &&
        (<ul className="programs-list">
        {
          programs.map((program) => (
            <li className="programs-list__item" key={program.hash}>
              <span className="programs-list__number">{program.programNumber}</span>
              <div className="program-wrapper">
                <div className="program-wrapper__name">
                  <span className="programs-list__name">{fileNameHandler(program.name)}</span>
                </div>
                <div className="program-wrapper__data">
                  <div className="programs-list__info">
                    Number of calls:<span className="programs-list__info-data">{program.callCount}</span>
                  </div>
                  <div className="programs-list__info">
                    Uploaded at:<span className="programs-list__info-data">{formatProgramDate(program.uploadedAt)}</span>
                  </div>
                </div>
              </div>
              <div className="programs-list--btns">
                <button 
                  className="programs-list__message-btn" 
                  type="button" 
                  aria-label="refresh"
                  onClick={() => handleSendMessage(program.hash, program.name)}
                >
                  <img src={MessageIllustration} alt="message" />
                </button>
                <button 
                  className="programs-list__refresh-btn" 
                  type="button" 
                  aria-label="refresh"
                  onClick={() => handleRefreshProgram(program.hash)}
                >
                  <img src={RefreshIllustration} alt="refresh" />
                </button>
              </div>
            </li>
          ))
        }
      </ul>)
      ||
      (
        <div className="no-message">There are no uploaded programs</div>
      )
    }
  </div>
  )
};
