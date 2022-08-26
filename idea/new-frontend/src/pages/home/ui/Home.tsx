import { useEffect, useState } from 'react';
import { useAlert } from '@gear-js/react-hooks';

import { getPrograms } from 'api';
import { ProgramModel } from 'entities/program';

// import styles from './Home.module.scss';
import { PROGRAMS_LIMIT } from '../model/consts';
import { ProgramsList } from './programsList';

const Home = () => {
  const alert = useAlert();

  const [, setPrograms] = useState<ProgramModel[]>();

  useEffect(() => {
    getPrograms({ limit: PROGRAMS_LIMIT })
      .then((data) => setPrograms(data.result.programs))
      .catch((error) => alert.error(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ProgramsList />;
};

export { Home };
