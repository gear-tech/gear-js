import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Hex, WaitlistItem } from '@gear-js/api';
import { useApi, useAlert, useAccount } from '@gear-js/react-hooks';

import styles from './Program.module.scss';
import { Params } from './types';
import { ProgramInfo } from './children/ProgramInfo';

import { useProgram } from 'hooks';
import { getMessages } from 'services';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import { MessageModel } from 'types/message';
import { Box } from 'layout/Box/Box';
import { Spinner } from 'components/common/Spinner/Spinner';
import { MessagesList } from 'components/blocks/MessagesList';
import { ProgramWaitlist } from 'components/blocks/ProgramWaitlist';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';

const Program = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();

  const { programId } = useParams() as Params;
  const { program, metadata } = useProgram(programId);

  const [waitlist, setWaitlist] = useState<WaitlistItem[]>();
  const [messages, setMessages] = useState<MessageModel[]>();

  const decodedAddress = account?.decodedAddress;

  useEffect(() => {
    setMessages(undefined);

    if (decodedAddress) {
      const messageParams = {
        source: programId,
        destination: decodedAddress,
        limit: INITIAL_LIMIT_BY_PAGE,
      };

      getMessages(messageParams)
        .then(({ result }) => setMessages(result.messages))
        .catch((error: Error) => alert.error(error.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedAddress]);

  useEffect(() => {
    api.waitlist
      .read(programId as Hex)
      .then(setWaitlist)
      .catch((error: Error) => alert.error(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isMesssagesLoading = !messages && Boolean(account);

  return (
    <div className="wrapper">
      {program ? (
        <>
          <PageHeader title="Program" fileName={program.name || programId} />
          <Box>
            <ProgramInfo program={program} metadata={metadata} />
          </Box>
          <div className={styles.messages}>
            <h2 className={styles.messagesCaption}>Messages</h2>
            <MessagesList messages={messages} isLoading={isMesssagesLoading} className={styles.messagesList} />
          </div>
          <ProgramWaitlist waitlist={waitlist} />
        </>
      ) : (
        <Spinner absolute />
      )}
    </div>
  );
};

export { Program };
