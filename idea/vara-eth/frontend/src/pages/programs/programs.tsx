import { ProgramsTable } from '@/features/programs';
import styles from './programs.module.scss';

const Programs = () => {
  return (
    <div className={styles.container}>
      <ProgramsTable />
    </div>
  );
};

export { Programs };
