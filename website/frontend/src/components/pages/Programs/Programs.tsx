import { useLocation } from 'react-router-dom';

import styles from './Programs.module.scss';
import { All } from './children/All';
import { Upload } from './children/Upload';
import { Recent } from './children/Recent';
import { Messages } from './children/Messages';

import { routes } from 'routes';
import { ProgramSwitch } from 'components/blocks/ProgramSwitch/ProgramSwitch';

const Programs = () => {
  const { pathname } = useLocation();

  const getCurrentPage = () => {
    switch (pathname) {
      case routes.main:
        return <Upload />;
      case routes.messages:
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
