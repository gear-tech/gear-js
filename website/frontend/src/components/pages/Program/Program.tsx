import React, { VFC, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { getWasmMetadata, Metadata } from '@gear-js/api';
import { MetaData } from './children/MetaData/MetaData';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import { MessagesList } from 'components/blocks/MessagesList/MessagesList';
import { formatDate } from 'helpers';
import MessageIcon from 'assets/images/message.svg';
import ArrowBack from 'assets/images/arrow_back.svg';
import ProgramIllustration from 'assets/images/program_icon.svg';
import { getMessages, getProgram } from 'services';
import { ProgramModel } from 'types/program';
import { MessageModel } from 'types/message';
import { INITIAL_LIMIT_BY_PAGE, LOCAL_STORAGE } from 'consts';
import styles from './Program.module.scss';

export const Program: VFC = () => {
  const navigate = useNavigate();

  const params = useParams();
  const id = params.id as string;

  const [program, setProgram] = useState<ProgramModel>();
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  const isState = !!metadata?.meta_state_output;

  useEffect(() => {
    const messageParams = {
      source: id,
      destination: localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW),
      limit: INITIAL_LIMIT_BY_PAGE,
    };

    getProgram(id).then(({ result }) => setProgram(result));
    getMessages(messageParams).then(({ result }) => setMessages(result.messages));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const metaFile = program?.meta?.metaFile;

    if (metaFile) {
      const metaBuffer = Buffer.from(metaFile, 'base64');
      getWasmMetadata(metaBuffer).then(setMetadata);
    }
  }, [program]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return program ? (
    <div className={styles.program}>
      <button type="button" aria-label="arrowBack" className={styles.goBack} onClick={handleGoBack}>
        <img src={ArrowBack} alt="back" />
        <img src={ProgramIllustration} alt="program" className={styles.goBackIcon} />
        <span className={styles.goBackText}>{program.name}</span>
      </button>
      <div className={styles.container}>
        <div className={styles.list}>
          <div className={styles.item}>
            <p className={styles.itemCaption}>Id:</p>
            <p className={styles.itemValue}>{program.id}</p>
          </div>
          <div className={styles.item}>
            <p className={styles.itemCaption}>Name:</p>
            <p className={styles.itemValue}>{program.name}</p>
          </div>
          <div className={styles.item}>
            <p className={styles.itemCaption}>Title:</p>
            <p className={styles.itemValue}>{program.title ? program.title : '...'}</p>
          </div>
          <div className={styles.item}>
            <p className={clsx(styles.itemCaption, styles.top)}>Metadata:</p>
            {metadata ? <MetaData metadata={metadata} /> : <p className={styles.emptyMetadata}>No metadata</p>}
          </div>
          <div className={styles.item}>
            <div className={styles.buttons}>
              <Link to={`/send/message/${id}`} className={clsx(styles.button, styles.link)}>
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
                <span className={styles.buttonTimestamp}>{formatDate(program.timestamp)}</span>
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
  ) : (
    <div className={styles.program}>
      <Spinner />
    </div>
  );
};
