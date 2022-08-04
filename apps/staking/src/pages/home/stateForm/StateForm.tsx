import { Button } from '@gear-js/ui';

import { Subtitle } from 'components/common/subtitle';
import { IndicatorValue } from 'components/common/indicatorValue';
import awardSVG from 'assets/images/award.svg';
import filledMoneySVG from 'assets/images/filledMoney.svg';
import filledMedalSVG from 'assets/images/filledMedal.svg';

import styles from './StateForm.module.scss';

function StateForm() {
  return (
    <>
      <Subtitle className={styles.subtitle}>State form</Subtitle>
      <IndicatorValue name="Staked Balance" icon={filledMoneySVG} value="2" className={styles.indicator} />
      <IndicatorValue name="Total Rewards" icon={filledMedalSVG} value="1" className={styles.indicator} />
      <IndicatorValue name="Latest Reward" icon={awardSVG} value="2" className={styles.indicator} isHighlighted />
      <Button text="Get reward" className={styles.button} />
    </>
  );
}

export { StateForm };
