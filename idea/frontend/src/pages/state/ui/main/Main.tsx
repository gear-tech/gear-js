import { Input } from '@gear-js/ui';
import { generatePath } from 'react-router-dom';

import { Box } from 'shared/ui/box';
import { UILink } from 'shared/ui/uiLink';
import { BackButton } from 'shared/ui/backButton';
import ReadSVG from 'shared/assets/images/actions/read.svg?react';
import ApplySVG from 'shared/assets/images/actions/apply.svg?react';

import { useProgramId } from '../../hooks';
import styles from './Main.module.scss';

const Main = () => {
  const programId = useProgramId();

  return (
    <>
      <Box className={styles.box}>
        <Input label="Program ID:" gap="1/5" value={programId} readOnly />
      </Box>

      <h3 className={styles.heading}>Choose how to read state:</h3>
      <div className={styles.buttons}>
        <UILink
          to={generatePath('/state/full/:programId', { programId })}
          text="Read full state"
          color="secondary"
          size="large"
          icon={ReadSVG}
        />
        <UILink
          to={generatePath('/state/wasm/:programId', { programId })}
          text="Read state using wasm"
          color="secondary"
          size="large"
          icon={ApplySVG}
        />
        <BackButton />
      </div>
    </>
  );
};

export { Main };
