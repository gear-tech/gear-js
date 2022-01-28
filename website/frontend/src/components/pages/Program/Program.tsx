import React, { VFC, useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { getTypeStructure, getWasmMetadata, Metadata, parseHexTypes } from '@gear-js/api';
import { RootState } from 'store/reducers';
import { getProgramAction, resetProgramAction, getMessagesAction } from 'store/actions/actions';
import { MessagesList } from 'components/blocks/MessagesList/MessagesList';
import { formatDate, getPreformattedText } from 'helpers';
import MessageIcon from 'assets/images/message.svg';
import ArrowBack from 'assets/images/arrow_back.svg';
import ProgramIllustration from 'assets/images/program_icon.svg';
import { INITIAL_LIMIT_BY_PAGE, LOCAL_STORAGE } from 'consts';

import styles from './Program.module.scss';

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
    timestamp: 'Loading ...',
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
        timestamp: program.timestamp ? formatDate(String(program.timestamp)) : '...',
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
    <div className={styles.program}>
      <button type="button" aria-label="arrowBack" className={styles.goBack} onClick={handleGoBack}>
        <img src={ArrowBack} alt="back" />
        <img src={ProgramIllustration} alt="program" className={styles.goBackIcon} />
        <span className={styles.goBackText}>{data.name}</span>
      </button>
      <div className={styles.container}>
        <div className={styles.list}>
          <div className={styles.item}>
            <p className={styles.itemCaption}>Id:</p>
            <p className={styles.itemValue}>{data.id}</p>
          </div>
          <div className={styles.item}>
            <p className={styles.itemCaption}>Name:</p>
            <p className={styles.itemValue}>{data.name}</p>
          </div>
          <div className={styles.item}>
            <p className={styles.itemCaption}>Title:</p>
            <p className={clsx(styles.itemTextarea, styles.itemTextareaH100)}>{data.title}</p>
          </div>
          <div className={styles.item}>
            <p className={styles.itemCaption}>Metadata:</p>
            <pre className={clsx(styles.itemTextarea, styles.itemTextareaH420)}>{data.meta}</pre>
          </div>
          <div className={styles.item}>
            <div className={styles.buttons}>
              <Link to={`/send-message/${id}`} className={clsx(styles.button, styles.link)}>
                <img src={MessageIcon} alt="message" className={styles.buttonIcon} />
                <span className={styles.buttonText}>Send Message</span>
              </Link>
              {isState && (
                <Link to={`/state/${id}`} className={clsx(styles.button, styles.link)}>
                  <span className={styles.buttonText}>Read State</span>
                </Link>
              )}
              <div className={styles.buttonUpload}>
                <span className={styles.buttonCaption}>Uploaded at:</span>
                <span className={styles.buttonTimestamp}>{data.timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.messages}>
        <p className={styles.messagesCaption}>MESSAGES</p>
        <MessagesList messages={messages} />
      </div>
    </div>
  );
};
