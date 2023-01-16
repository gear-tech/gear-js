import { Input, Textarea } from '@gear-js/ui';
import clsx from 'clsx';

import { useStateRead } from 'hooks';
import { useMetadata } from 'pages/state/hooks';
import { useEffect } from 'react';
import { getPreformattedText } from 'shared/helpers';
import { BackButton } from 'shared/ui/backButton';
import { Box } from 'shared/ui/box';

import { useProgramId } from '../../hooks';
import styles from './Full.module.scss';

const Full = () => {
  const programId = useProgramId();
  const metadata = useMetadata(programId);
  const { state, isStateRead, readFullState } = useStateRead(programId);

  const value = getPreformattedText(state);
  const className = clsx(!isStateRead && styles.loading);

  useEffect(() => {
    if (metadata) readFullState(metadata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  return (
    <>
      <Box className={styles.box}>
        <Input label="Program ID:" gap="1/5" value={programId} readOnly />
        <Textarea label="Statedata:" gap="1/5" rows={15} value={value} className={className} readOnly block />
      </Box>

      <BackButton />
    </>
  );
};

export { Full };
