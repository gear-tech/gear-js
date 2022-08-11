import { useForm } from '@mantine/form';
import { Button } from '@gear-js/ui';

import { useStakingMessage } from 'hooks';
import { FTOKEN_CONTRACT_ADDRESS } from 'consts';
import { ProgramMessage } from 'types/message';
import { Subtitle } from 'components/common/subtitle';
import { FormField } from 'components/common/formField';

import styles from './UpdateStakingForm.module.scss';
import { FieldName, FormValues } from './types';
import { FORM_CONFIG } from './consts';

type Props = {
  isStakingActive: boolean;
};

function UpdateStakingForm({ isStakingActive }: Props) {
  const sendMessage = useStakingMessage();

  const { errors, reset, onSubmit, getInputProps } = useForm<FormValues>(FORM_CONFIG);

  const handleSubmit = onSubmit((values) => {
    const distributionTime = Date.parse(values.distributionTime) - Date.now();

    sendMessage(
      {
        [ProgramMessage.UpdateStaking]: {
          rewardTotal: values.rewardTotal,
          distributionTime,
          rewardTokenAddress: FTOKEN_CONTRACT_ADDRESS,
          stakingTokenAddress: FTOKEN_CONTRACT_ADDRESS,
        },
      },
      { onSuccess: reset },
    );
  });

  const isDisabled = Object.values(errors).some((error) => Boolean(error)) || isStakingActive;

  return (
    <>
      <Subtitle>Update staking form</Subtitle>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField
          type="datetime-local"
          label="Reward payout interval"
          placeholder="Enter time"
          {...getInputProps(FieldName.DistributionTime)}
        />
        <FormField
          min={0}
          type="number"
          label="Reward to be distributed"
          placeholder="Enter reward"
          {...getInputProps(FieldName.Reward)}
        />
        <Button type="submit" text="Submit" disabled={isDisabled} className={styles.submitBtn} />
      </form>
    </>
  );
}

export { UpdateStakingForm };
