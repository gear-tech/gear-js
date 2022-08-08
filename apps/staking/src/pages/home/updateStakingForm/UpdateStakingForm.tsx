import { useForm } from '@mantine/form';
import { Button } from '@gear-js/ui';

import { useStakingMessage } from 'hooks';
import { ProgramMessage } from 'types/message';
import { Subtitle } from 'components/common/subtitle';
import { FormField } from 'components/common/formField';

import styles from './UpdateStakingForm.module.scss';
import { FieldName, FormValues } from './types';
import { FORM_CONFIG } from './consts';

function UpdateStakingForm() {
  const sendMessage = useStakingMessage();

  const { errors, reset, onSubmit, getInputProps } = useForm<FormValues>(FORM_CONFIG);

  const handleSubmit = onSubmit((values) => {
    const unixDate = Date.parse(values.distributionTime);

    sendMessage(
      {
        [ProgramMessage.UpdateStaking]: {
          ...values,
          distributionTime: unixDate - Date.now(),
        },
      },
      { onSuccess: reset },
    );
  });

  const isValid = Object.values(errors).every((error) => !error);

  return (
    <>
      <Subtitle>Update staking form</Subtitle>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField
          label="Staking token address"
          placeholder="Enter address"
          {...getInputProps(FieldName.StakingAddress)}
        />
        <FormField
          label="Reward token address"
          placeholder="Enter address"
          {...getInputProps(FieldName.RewardAddress)}
        />
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
        <Button type="submit" text="Submit" disabled={!isValid} className={styles.submitBtn} />
      </form>
    </>
  );
}

export { UpdateStakingForm };
