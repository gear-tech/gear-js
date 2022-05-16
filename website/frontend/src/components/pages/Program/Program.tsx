import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Link, useParams } from 'react-router-dom';

import styles from './Program.module.scss';
import { MetaData } from './children/MetaData/MetaData';

import { formatDate } from 'helpers';
import { useProgram } from 'hooks';
import { getMessages } from 'services';
import { INITIAL_LIMIT_BY_PAGE, LOCAL_STORAGE } from 'consts';
import { MessageModel } from 'types/message';
import MessageIcon from 'assets/images/message.svg';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import { MessagesList } from 'components/blocks/MessagesList/MessagesList';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';

const Program = () => {
  const params = useParams();
  const id = params.id as string;

  const [program, metadata] = useProgram(id);
  const [messages, setMessages] = useState<MessageModel[]>([]);

  const isState = !!metadata?.meta_state_output;

  useEffect(() => {
    const messageParams = {
      source: id,
      destination: localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW),
      limit: INITIAL_LIMIT_BY_PAGE,
    };

    getMessages(messageParams).then(({ result }) => setMessages(result.messages));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.program}>
      {program ? (
        <>
          <PageHeader fileName={program.name || ''} />
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
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export { Program };
