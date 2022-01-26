import React, { VFC, useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTypeStructure, getWasmMetadata, Metadata, parseHexTypes } from '@gear-js/api';
import { RootState } from 'store/reducers';
import { getProgramAction, resetProgramAction, getMessagesAction } from 'store/actions/actions';
import { MessagesList } from 'components/blocks/MessagesList/MessagesList';
import { formatDate, getPreformattedText } from 'helpers';
import MessageIcon from 'assets/images/message.svg';
import ArrowBack from 'assets/images/arrow_back.svg';
import ProgramIllustration from 'assets/images/program_icon.svg';
import { INITIAL_LIMIT_BY_PAGE, LOCAL_STORAGE } from 'consts';
import './Program.scss';

type Params = { id: string };
export const Program: VFC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams<Params>();

  const id = params.id;

  const { program } = useSelector((state: RootState) => state.programs);
  const { messages } = useSelector((state: RootState) => state.messages);
  const [data, setData] = useState({
    id: 'Loading ...',
    name: 'Loading ...',
    title: 'Loading ...',
    uploadedAt: 'Loading ...',
    meta: 'Loading ...',
  });
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const isState = !!metadata?.meta_state_output;

  useEffect(() => {
    dispatch(getProgramAction(id));
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  useEffect(() => {
    if (program) {
      let meta = '';

      if (program.meta) {
        const parsedMeta: Metadata = JSON.parse(program.meta.meta as string);
        const displayedTypes = parseHexTypes(parsedMeta.types!);
        const inputType = getTypeStructure(parsedMeta.handle_input!, displayedTypes);
        meta = getPreformattedText(inputType);
      }

      setData({
        id: program.id,
        name: program.name ? program.name : '...',
        title: program.title ? program.title : '...',
        uploadedAt: program.uploadedAt ? formatDate(String(program.uploadedAt)) : '...',
        meta,
      });
    }
    return () => {
      dispatch(resetProgramAction());
    };
  }, [dispatch, program, setData, id]);

  useEffect(() => {
    dispatch(
      getMessagesAction({
        source: id,
        destination: localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW),
        limit: INITIAL_LIMIT_BY_PAGE,
      })
    );
  }, [dispatch, id]);

  useEffect(() => {
    const metaFile = program?.meta?.metaFile;

    if (metaFile) {
      const metaBuffer = Buffer.from(metaFile, 'base64');
      getWasmMetadata(metaBuffer).then(setMetadata);
    }
  }, [program]);

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
          <div className="block__item">
            <div className="block__button">
              <Link to={`/send-message/${id}`} className="block__button-elem block__button-elem--link">
                <img src={MessageIcon} alt="message" className="block__button-icon" />
                <span className="block__button-text">Send Message</span>
              </Link>
              {isState && (
                <Link to={`/state/${id}`} className="block__button-elem block__button-elem--link">
                  <span className="block__button-text">Read State</span>
                </Link>
              )}
              <div className="block__button-upload">
                <span className="block__button-caption">Uploaded at:</span>
                <span className="block__button-date">{data.uploadedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="messages-block">
        <p className="messages-block__caption">MESSAGES</p>
        <MessagesList messages={messages} />
      </div>
    </div>
  );
};
