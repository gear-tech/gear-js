import { Button } from '@gear-js/ui';

import { useStakingMessage } from 'hooks';
import { Staker } from 'types/state';
import { ProgramMessage } from 'types/message';
import { Subtitle } from 'components/common/subtitle';
import { IndicatorValue } from 'components/common/indicatorValue';
import filledMoneySVG from 'assets/images/filledMoney.svg';
import filledMedalSVG from 'assets/images/filledMedal.svg';

import styles from './StateForm.module.scss';

type Props = {
  staker: Staker;
  updateStakerReward: (value: number) => void;
};

function StateForm({ staker, updateStakerReward }: Props) {
  const sendMessage = useStakingMessage();

  const handleClick = () => {
    const onSuccess = () => updateStakerReward(0);

    sendMessage({ [ProgramMessage.GetReward]: null }, { onSuccess });
  };

  return (
    <>
      <Subtitle className={styles.subtitle}>State form</Subtitle>
      <IndicatorValue name="Staked Balance" icon={filledMoneySVG} value={staker.balance} className={styles.indicator} />
      <IndicatorValue
        name="Total Rewards"
        icon={filledMedalSVG}
        value={staker.reward}
        isHighlighted
        className={styles.indicator}
      />
      <Button text="Get reward" className={styles.button} onClick={handleClick} />
    </>
  );
}

export { StateForm };
