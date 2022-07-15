import { SendMessageForm } from './children/SendMessageForm';

import { Box } from 'layout/Box/Box';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';

const Send = () => (
  <div className="wrapper">
    <PageHeader title="New message" />
    <Box>
      <SendMessageForm />
    </Box>
  </div>
);

export { Send };
