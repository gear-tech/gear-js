import React, { FC } from 'react';
import { Box } from 'layout/Box/Box';
import { AccountId } from './children/AccountId/AccountId';

export const Mailbox: FC = () => {
  return (
    <Box>
      <AccountId />
    </Box>
  );
};
