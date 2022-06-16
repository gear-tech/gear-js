import { useLocation } from 'react-router-dom';

import styles from './Programs.module.scss';
import { Upload } from './children/Upload/Upload';
import { Recent } from './children/Recent/Recent';

import { routes } from 'routes';
import { All } from 'components/pages/Programs/children/All/All';
import { Messages } from 'components/pages/Messages/Messages';
import { ProgramSwitch } from 'components/blocks/ProgramSwitch/ProgramSwitch';

const Programs = () => {
  const { pathname } = useLocation();

  const getCurrentPage = () => {
    switch (pathname) {
      case routes.main:
        return <Upload />;
      case routes.message:
        return <Messages />;
      case routes.allPrograms:
        return <All />;
      case routes.uploadedPrograms:
        return <Recent />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.main}>
      <ProgramSwitch />
      {getCurrentPage()}
    </div>
  );
};

export { Programs };
