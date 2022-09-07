import { useParams } from 'react-router-dom';

import { useProgram } from 'hooks';
import { PathParams } from 'shared/types';

import styles from './Program.module.scss';
import { Header } from './header';
import { ProgramDetails } from './programDetails';
import { MetadataDetails } from './metadataDetails';

const Program = () => {
  const { programId } = useParams() as PathParams;

  const { program, metadata } = useProgram(programId);

  if (!program) {
    return null;
  }

  return (
    <div>
      <Header name={program.name || programId} />
      <div className={styles.content}>
        <ProgramDetails program={program} />
        <MetadataDetails metadata={metadata!} />
      </div>
    </div>
  );
};

export { Program };
