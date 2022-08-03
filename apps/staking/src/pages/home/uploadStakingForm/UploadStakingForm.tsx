import { useForm } from '@mantine/form';
import { Button } from '@gear-js/ui';

import { Subtitle } from 'components/common/subtitle';
import { FormField } from 'components/common/formField';

import styles from './UploadStakingForm.module.scss';
import { FieldName, FormValues } from './types';
import { FORM_CONFIG } from './consts';

function UploadStakingForm() {
  const { errors, onSubmit, getInputProps } = useForm<FormValues>(FORM_CONFIG);

  const handleSubmit = onSubmit(() => {});

  const isValid = Object.values(errors).every((error) => !error);

  return (
    <div className={styles.formWrapper}>
      <Subtitle>Init form</Subtitle>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField
          label="Staking token address"
          className="formInput"
          placeholder="Enter address"
          {...getInputProps(FieldName.StakingAddress, { withError: true })}
        />
        <FormField
          label="Reward token address"
          className="formInput"
          placeholder="Enter address"
          {...getInputProps(FieldName.RewardAddress)}
        />
        <FormField
          min={0}
          type="number"
          label="Reward payout interval"
          className="formInput"
          placeholder="Enter time"
          {...getInputProps(FieldName.Interval)}
        />
        <FormField
          label="Reward to be distributed"
          className="formInput"
          placeholder="Enter reward"
          {...getInputProps(FieldName.Reward)}
        />
        <Button type="submit" text="Submit" disabled={!isValid} className={styles.submitBtn} />
      </form>
    </div>
  );
}

export { UploadStakingForm };
