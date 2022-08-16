import { useParams } from 'react-router-dom';

import { Params } from './types';

import { Box } from 'layout/Box/Box';
import { PageHeader } from 'components/blocks/PageHeader';

const Code = () => {
  const { codeId } = useParams() as Params;

  return (
    <div className="wrapper">
      <PageHeader title="Initialize program" fileName={codeId} />
      <Box>
        <div />
      </Box>
    </div>
  );
};

export { Code };
