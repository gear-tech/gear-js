import { useForm } from '@mantine/form';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { useStakingMessage } from 'hooks';
import { ProgramMessage } from 'types/message';
import { Subtitle } from 'components/common/subtitle';
import { FormField } from 'components/common/formField';
import { IndicatorValue } from 'components/common/indicatorValue';
import filledMoneySVG from 'assets/images/filledMoney.svg';
import { getValidation } from './helpers';

import styles from './WithdrawForm.module.scss';
import { INITIAL_VALUES } from './consts';
import { FieldName, FormValues } from './types';

type Props = {
  balance: number;
  updateStakerBalance: (balance: number) => void;
};

function WithdrawForm({ balance, updateStakerBalance }: Props) {
  const alert = useAlert();

  const { errors, reset, onSubmit, getInputProps } = useForm<FormValues>({
    initialValues: INITIAL_VALUES,
    validate: getValidation(balance),
  });

  const sendMessage = useStakingMessage();

  const handleSubmit = onSubmit((values) => {
    if (balance === 0) {
      alert.error('Staked balance is 0');

      return;
    }

    const amount = +values.amount;

    const onSuccess = () => {
      updateStakerBalance(balance - amount);
      reset();
    };

    sendMessage({ [ProgramMessage.Withdraw]: amount }, { onSuccess });
  });

  const isInvalid = Boolean(errors[FieldName.Amount]);

  return (
    <>
      <Subtitle className={styles.subtitle}>Withdraw form</Subtitle>
      <IndicatorValue name="Staked Balance" icon={filledMoneySVG} value={balance} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField
          min={1}
          type="number"
          label="Amount"
          isFocused
          placeholder="Enter withdraw amount"
          {...getInputProps(FieldName.Amount)}
        />
        <Button type="submit" text="Submit" disabled={isInvalid} className={styles.submitBtn} />
      </form>
    </>
  );
}

export { WithdrawForm };
