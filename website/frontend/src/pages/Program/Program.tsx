import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './Program.module.scss';
import { Params } from './types';
import { ProgramInfo } from './children/ProgramInfo';

import { useProgram } from 'hooks';
import { getMessages } from 'services';
import { INITIAL_LIMIT_BY_PAGE, LOCAL_STORAGE } from 'consts';
import { MessageModel } from 'types/message';
import { Box } from 'layout/Box/Box';
import { Spinner } from 'components/common/Spinner/Spinner';
import { MessagesList } from 'components/blocks/MessagesList';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';

const Program = () => {
  const { programId } = useParams() as Params;

  const [program, metadata] = useProgram(programId);
  const [messages, setMessages] = useState<MessageModel[]>([]);

  useEffect(() => {
    const messageParams = {
      source: programId,
      destination: localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW),
      limit: INITIAL_LIMIT_BY_PAGE,
    };

    getMessages(messageParams).then(({ result }) => setMessages(result.messages));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wrapper">
      {program ? (
        <>
          <PageHeader title="Program" fileName={program.name} />
          <Box>
            <ProgramInfo program={program} metadata={metadata} />
          </Box>
          <div className={styles.messages}>
            <h2 className={styles.messagesCaption}>Messages</h2>
            <MessagesList messages={messages} />
          </div>
        </>
      ) : (
        <Spinner absolute />
      )}
    </div>
  );
};

export { Program };
