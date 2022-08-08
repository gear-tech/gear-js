import { useForm } from '@mantine/form';
import { Button } from '@gear-js/ui';

import { Subtitle } from 'components/common/subtitle';
import { FormField } from 'components/common/formField';
import { IndicatorValue } from 'components/common/indicatorValue';
import filledMoneySVG from 'assets/images/filledMoney.svg';

import styles from './WithdrawForm.module.scss';
import { FORM_CONFIG } from './consts';
import { FieldName, FormValues } from './types';

type Props = {
  balance: string;
};

function WithdrawForm({ balance }: Props) {
  const { errors, onSubmit, getInputProps } = useForm<FormValues>(FORM_CONFIG);

  const handleSubmit = onSubmit(() => {});

  const isInvalid = Boolean(errors[FieldName.Amount]);

  return (
    <>
      <Subtitle className={styles.subtitle}>Withdraw form</Subtitle>
      <IndicatorValue name="Staked Balance" icon={filledMoneySVG} value={balance} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField label="Amount" placeholder="Enter withdraw amount" {...getInputProps(FieldName.Amount)} />
        <Button type="submit" text="Submit" disabled={isInvalid} className={styles.submitBtn} />
      </form>
    </>
  );
}

export { WithdrawForm };
