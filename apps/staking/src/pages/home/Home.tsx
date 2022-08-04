import { useState } from 'react';

import { Box } from 'components/common/box';
import { Switcher } from 'components/common/switcher';
import { ReactComponent as CubeSVG } from 'assets/images/cube.svg';

import styles from './Home.module.scss';
import { SWITCHER_ITEMS, SwitcerValue } from './consts';
import { StakersList } from './stakersList';
import { StakeForm } from './stakeForm';
import { StateForm } from './stateForm';
import { WithdrawForm } from './withdrawForm';
import { UploadStakingForm } from './uploadStakingForm';

function Home() {
  const [activeValue, setActiveValue] = useState<string>(SwitcerValue.Stake);

  const getContent = () => {
    switch (activeValue) {
      case SwitcerValue.Init:
        return <UploadStakingForm />;
      case SwitcerValue.List:
        return <StakersList />;
      case SwitcerValue.Stake:
        return <StakeForm />;
      case SwitcerValue.State:
        return <StateForm />;
      case SwitcerValue.Withdraw:
        return <WithdrawForm />;
      default:
        return null;
    }
  };

  return (
    <>
      <h1 className={styles.heading}>Stacking</h1>
      <div className={styles.content}>
        <div className={styles.cubeWrapper}>
          <CubeSVG />
        </div>
        <div className={styles.main}>
          <Switcher value={activeValue} items={SWITCHER_ITEMS} onChange={setActiveValue} />
          <Box>{getContent()}</Box>
        </div>
      </div>
    </>
  );
}

export { Home };
