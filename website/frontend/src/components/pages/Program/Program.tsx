import React, { VFC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTypeStructure, Metadata, parseHexTypes } from '@gear-js/api';
import { useParams, useHistory } from 'react-router-dom';
import { RootState } from 'store/reducers';
import {
  getProgramAction,
  sendMessageResetAction,
  resetProgramPayloadTypeAction,
  resetGasAction,
  uploadMetaResetAction,
  resetProgramAction,
} from 'store/actions/actions';
import { Message } from 'components/pages/Programs/children/Message/Message';
import { Meta } from 'components/Meta/Meta';
import { formatDate } from 'helpers';
import MessageIcon from 'assets/images/message.svg';
import ArrowBack from 'assets/images/arrow_back.svg';
import ProgramIllustration from 'assets/images/program_icon.svg';
import './Program.scss';

type ProgramMessageType = {
  programName: string;
  programHash: string;
};

export const Program: VFC = () => {
  const dispatch = useDispatch();
  const params: any = useParams();
  const hash: string = params?.hash;
  const history = useHistory();
  const { program } = useSelector((state: RootState) => state.programs);
  const [programMessage, setProgramMessage] = useState<ProgramMessageType | null>(null);
  const [programMeta, setProgramMeta] = useState<ProgramMessageType | null>(null);
  const [data, setData] = useState({
    id: 'Loading ...',
    name: 'Loading ...',
    title: 'Loading ...',
    uploadedAt: 'Loading ...',
    meta: 'Loading ...',
  });

  useEffect(() => {
    dispatch(getProgramAction(hash));
    window.scrollTo(0, 0);
  }, [dispatch, hash]);

  useEffect(() => {
    if (program) {
      let meta = '';

      if (program.meta) {
        const parsedMeta: Metadata = JSON.parse(program.meta.meta as string);
        const displayedTypes = parseHexTypes(parsedMeta.types!);
        const inputType = getTypeStructure(parsedMeta.handle_input!, displayedTypes);
        meta = JSON.stringify(inputType, null, 4);
      }

      setData({
        id: program.hash,
        name: program.name ? program.name : '...',
        title: program.title ? program.title : '...',
        uploadedAt: program.uploadedAt ? formatDate(String(program.uploadedAt)) : '...',
        meta,
      });
    }
    return () => {
      dispatch(resetProgramAction());
    };
  }, [dispatch, program, setData, hash]);

  const handleOpenForm = (programHash: string, programName?: string, isMessage?: boolean) => {
    if (programName) {
      if (isMessage) {
        setProgramMessage({ programHash, programName });
      } else {
        setProgramMeta({ programHash, programName });
      }
    }
  };

  const handleCloseMessageForm = () => {
    dispatch(sendMessageResetAction());
    dispatch(resetGasAction());
    dispatch(resetProgramPayloadTypeAction());
    setProgramMessage(null);
  };

  const handleCloseMetaForm = () => {
    dispatch(uploadMetaResetAction());
    setProgramMeta(null);
  };

  if (programMessage) {
    return (
      <Message
        programHash={programMessage.programHash}
        programName={programMessage.programName}
        handleClose={handleCloseMessageForm}
      />
    );
  }

  if (programMeta) {
    return (
      <Meta
        programHash={programMeta.programHash}
        programName={programMeta.programName}
        handleClose={handleCloseMetaForm}
      />
    );
  }

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div className="wrapper">
      <button type="button" aria-label="arrowBack" className="go-back-button" onClick={handleGoBack}>
        <img src={ArrowBack} alt="back" />
        <img src={ProgramIllustration} alt="program" className="go-back-button__icon" />
        <span className="go-back-button__text">{data.name}</span>
      </button>
      <div className="block">
        <div className="block__wrapper">
          <div className="block__item">
            <p className="block__caption">Id:</p>
            <p className="block__field">{data.id}</p>
          </div>
          <div className="block__item">
            <p className="block__caption">Name:</p>
            <p className="block__field">{data.name}</p>
          </div>
          <div className="block__item">
            <p className="block__caption">Title:</p>
            <p className="block__textarea block__textarea_h100">{data.title}</p>
          </div>
          <div className="block__item">
            <p className="block__caption">Metadata:</p>
            <pre className="block__textarea block__textarea_h420">{data.meta}</pre>
          </div>
          <div className="block__item block__item_last">
            <div className="block__button">
              <button
                className="block__button-elem"
                type="button"
                aria-label="refresh"
                onClick={() => handleOpenForm(String(data.id), data.name, true)}
              >
                <img src={MessageIcon} alt="message" />
                <span className="block__button-text">Send Message</span>
              </button>
              <div className="block__button-upload">
                <span className="block__button-caption">Uploaded at:</span>
                <span className="block__button-date">{data.uploadedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
