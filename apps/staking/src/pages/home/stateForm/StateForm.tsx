import { Button } from '@gear-js/ui';

import { useStakingMessage } from 'hooks';
import { getReward } from 'utils';
import { Staker } from 'types/state';
import { ProgramMessage } from 'types/message';
import { Subtitle } from 'components/common/subtitle';
import { IndicatorValue } from 'components/common/indicatorValue';
import awardSVG from 'assets/images/award.svg';
import filledMoneySVG from 'assets/images/filledMoney.svg';
import filledMedalSVG from 'assets/images/filledMedal.svg';

import styles from './StateForm.module.scss';

type Props = {
  staker: Staker;
};

function StateForm({ staker }: Props) {
  const sendMessage = useStakingMessage();

  const handleClick = () => sendMessage({ [ProgramMessage.GetReward]: null });

  return (
    <>
      <Subtitle className={styles.subtitle}>State form</Subtitle>
      <IndicatorValue name="Staked Balance" icon={filledMoneySVG} value={staker.balance} className={styles.indicator} />
      <IndicatorValue
        name="Total Rewards"
        icon={filledMedalSVG}
        value={getReward(staker)}
        className={styles.indicator}
      />
      <IndicatorValue name="Latest Reward" icon={awardSVG} value={2} className={styles.indicator} isHighlighted />
      <Button text="Get reward" className={styles.button} onClick={handleClick} />
    </>
  );
}

export { StateForm };
