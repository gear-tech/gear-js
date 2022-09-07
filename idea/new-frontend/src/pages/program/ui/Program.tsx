import { useParams } from 'react-router-dom';

import { useProgram } from 'hooks';
import { PathParams } from 'shared/types';

import styles from './Program.module.scss';
import { Header } from './header';
import { ProgramDetails } from './programDetails';

const Program = () => {
  const { programId } = useParams() as PathParams;

  const { program } = useProgram(programId);

  if (!program) {
    return null;
  }

  return (
    <div>
      <Header name=" " />
      <div className={styles.content}>
        <ProgramDetails program={program} />
      </div>
    </div>
  );
};

export { Program };
