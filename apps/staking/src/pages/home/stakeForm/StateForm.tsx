import { useForm } from '@mantine/form';
import { Button } from '@gear-js/ui';
import { useSendMessage } from '@gear-js/react-hooks';

import { useStakingMessage } from 'hooks';
import { FTOKEN_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS } from 'consts';
import { ProgramMessage } from 'types/message';
import { Subtitle } from 'components/common/subtitle';
import { FormField } from 'components/common/formField';
import { IndicatorValue } from 'components/common/indicatorValue';
import fungibleTokenMetaWasm from 'assets/wasm/fungible_token-0.1.0.meta.wasm';
import filledMoneySVG from 'assets/images/filledMoney.svg';

import styles from './StakeForm.module.scss';
import { FORM_CONFIG } from './consts';
import { FieldName, FormValues } from './types';

type Props = {
  balance: number;
  updateStakerBalance: (balance: number) => void;
};

function StakeForm({ balance, updateStakerBalance }: Props) {
  const { errors, reset, onSubmit, getInputProps } = useForm<FormValues>(FORM_CONFIG);

  const sendMessageToFToken = useSendMessage(FTOKEN_CONTRACT_ADDRESS, fungibleTokenMetaWasm);
  const sendMessageToStaking = useStakingMessage();

  const handleSubmit = onSubmit((values) => {
    const amount = +values.amount;

    const onStakingSuccess = () => {
      updateStakerBalance(balance + amount);
      reset();
    };

    const onFTokenSuccess = () =>
      sendMessageToStaking({ [ProgramMessage.Stake]: amount }, { onSuccess: onStakingSuccess });

    sendMessageToFToken({ Approve: { to: STAKING_CONTRACT_ADDRESS, amount } }, { onSuccess: onFTokenSuccess });
  });

  const isInvalid = Boolean(errors[FieldName.Amount]);

  return (
    <>
      <Subtitle className={styles.subtitle}>Stake form</Subtitle>
      <IndicatorValue name="Staked Balance" icon={filledMoneySVG} value={balance} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField
          min={1}
          type="number"
          label="Stake"
          isFocused
          placeholder="Enter amount of tokens"
          {...getInputProps(FieldName.Amount)}
        />
        <Button type="submit" text="Submit" disabled={isInvalid} className={styles.submitBtn} />
      </form>
    </>
  );
}

export { StakeForm };
