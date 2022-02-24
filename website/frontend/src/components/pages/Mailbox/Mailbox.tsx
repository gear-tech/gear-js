import React, { FC } from 'react';
import { Box } from 'layout/Box/Box';
import { MailBoxContextProvider } from './context/context';
import { AccountId } from './children/AccountId/AccountId';
import { MailList } from './children/MailList/MailList';

export const Mailbox: FC = () => {
  return (
    <MailBoxContextProvider>
      <Box>
        <AccountId />
        <MailList />
      </Box>
    </MailBoxContextProvider>
  );
};
