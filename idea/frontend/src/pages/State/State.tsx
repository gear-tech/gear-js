import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Metadata } from '@gear-js/api';

import { PageParams } from './types';
import { StateForm } from './children/StateForm';

import { getMetadata } from 'services';
import { Box } from 'layout/Box/Box';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';
import { Spinner } from 'components/common/Spinner/Spinner';

const State = () => {
  const { programId } = useParams() as PageParams;

  const metaBuffer = useRef<Buffer>();
  const [metadata, setMetadata] = useState<Metadata>();

  useEffect(() => {
    getMetadata(programId).then(({ result }) => {
      const parsedMeta = JSON.parse(result.meta) as Metadata;

      metaBuffer.current = Buffer.from(result.metaFile, 'base64');
      setMetadata(parsedMeta);
    });
  }, [programId]);

  return (
    <div className="wrapper">
      {metadata && metaBuffer.current ? (
        <>
          <PageHeader title="Read state" />
          <Box>
            <StateForm metadata={metadata} programId={programId} metaBuffer={metaBuffer.current} />
          </Box>
        </>
      ) : (
        <Spinner absolute />
      )}
    </div>
  );
};

export { State };
