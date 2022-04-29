import { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import styles from './Meta.module.scss';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';
import { UploadMetaForm } from 'components/blocks/MetaForm/UploadMetaForm/UploadMetaForm';
import { Spinner } from 'components/blocks/Spinner/Spinner';

import { getProgram } from 'services';
import { ProgramModel } from 'types/program';
// import { StatusPanel } from 'components/blocks/StatusPanel/StatusPanel';

type Params = {
  programId: string;
};

export const Meta = () => {
  const { programId = '' } = useParams<Params>();

  const [program, setProgram] = useState<ProgramModel | null>(null);

  useEffect(() => {
    getProgram(programId).then(({ result }) => setProgram(result));
  }, [programId]);

  if (!program) {
    return (
      <div className="wrapper">
        <Spinner />
      </div>
    );
  }

  const programName = program?.name || program.id;

  return (
    <div className="wrapper">
      <PageHeader title="Upload metadata" fileName={programName} />
      <div className={styles.metaFormWrapper}>
        <UploadMetaForm programId={program.id} programName={programName} />
      </div>
      {/* {statusPanelText && (
      <StatusPanel
        onClose={() => {
          dispatch(uploadMetaResetAction());
        }}
        statusPanelText={statusPanelText}
        isError={!!metaUploadingError}
      />
      )} */}
    </div>
  );
};
