import { useForm } from '@mantine/form';
import { Button } from '@gear-js/ui';

import { Subtitle } from 'components/common/subtitle';
import { FormField } from 'components/common/formField';
import { IndicatorValue } from 'components/common/indicatorValue';
import filledMoneySVG from 'assets/images/filledMoney.svg';

import styles from './StakeForm.module.scss';
import { FORM_CONFIG } from './consts';
import { FieldName, FormValues } from './types';

function StakeForm() {
  const { errors, onSubmit, getInputProps } = useForm<FormValues>(FORM_CONFIG);

  const handleSubmit = onSubmit(() => {});

  const isInvalid = Boolean(errors[FieldName.Stake]);

  return (
    <>
      <Subtitle className={styles.subtitle}>Stake form</Subtitle>
      <IndicatorValue name="Staked Balance" icon={filledMoneySVG} value="5" />
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField label="Stake" placeholder="Enter amount of tokens" {...getInputProps(FieldName.Stake)} />
        <Button type="submit" text="Submit" disabled={isInvalid} className={styles.submitBtn} />
      </form>
    </>
  );
}

export { StakeForm };
