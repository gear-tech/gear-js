import { Stepper } from './children/Stepper';

import { Box } from 'layout/Box/Box';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';

const SendMessage = () => (
  <div className="wrapper">
    <PageHeader title="New message" />
    <Box>
      <Stepper />
    </Box>
  </div>
);

export { SendMessage };
