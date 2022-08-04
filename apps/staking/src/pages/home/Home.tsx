import { useState } from 'react';

import { Box } from 'components/common/box';
import { Switcher } from 'components/common/switcher';
import { ReactComponent as CubeSVG } from 'assets/images/cube.svg';

import styles from './Home.module.scss';
import { SWITCHER_ITEMS, SwitcerValue } from './consts';
import { StakersList } from './stakersList';
import { UploadStakingForm } from './uploadStakingForm';

function Home() {
  const [activeValue, setActiveValue] = useState<string>(SwitcerValue.List);

  return (
    <>
      <h1 className={styles.heading}>Stacking</h1>
      <div className={styles.content}>
        <div className={styles.cubeWrapper}>
          <CubeSVG />
        </div>
        <div className={styles.main}>
          <Switcher value={activeValue} items={SWITCHER_ITEMS} onChange={setActiveValue} />
          <Box>{activeValue === SwitcerValue.Init ? <UploadStakingForm /> : <StakersList />}</Box>
        </div>
      </div>
    </>
  );
}

export { Home };
