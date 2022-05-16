import { useParams } from 'react-router-dom';

import { UploadMetaForm } from 'components/blocks/UploadMetaForm';

import { Box } from 'layout/Box/Box';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';

import { useProgram } from 'hooks';

type Params = {
  programId: string;
};

export const Meta = () => {
  const { programId } = useParams() as Params;

  const [program] = useProgram(programId);

  const programName = program?.name || programId;

  return (
    <div className="wrapper">
      {program ? (
        <>
          <PageHeader title="Upload metadata" fileName={programName} />
          <Box>
            <UploadMetaForm programId={program.id} programName={programName} />
          </Box>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
