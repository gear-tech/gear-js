import { Button, Checkbox, Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { isHex } from '@polkadot/util';
import clsx from 'clsx';
import { useLotteryMessage } from 'hooks';
import { useEffect, useState } from 'react';
import styles from './Form.module.scss';

const initialValues = { duration: '', prizeFund: '', participationCost: '', tokenAddress: '' };

const getValidation = (isFungibleToken: boolean) => ({
  duration: (value: string) => (!value ? 'Duration is required' : null),
  prizeFund: (value: string) => (!value ? 'Prize fund is required' : null),
  participationCost: (value: string) => (!value ? 'Participation cost is required' : null),
  tokenAddress: (value: string) => (isFungibleToken && !isHex(value) ? 'Address should be hex' : null),
});

const S_MULTIPLIER = 60;
const MS_MULTIPLIER = 1000;

function Form() {
  const [isFungibleToken, setIsFungibleToken] = useState(false);
  const toggleToken = () => setIsFungibleToken((prevValue) => !prevValue);

  const form = useForm({ initialValues, validate: getValidation(isFungibleToken) });
  const { getInputProps, onSubmit, reset, setFieldValue, errors } = form;

  const sendMessage = useLotteryMessage();

  const checkboxClassName = clsx(styles.input, styles.checkbox);

  const resetForm = () => {
    reset();
    setIsFungibleToken(false);
  };

  const handleSubmit = (data: typeof initialValues) => {
    const duration = +data.duration * S_MULTIPLIER * MS_MULTIPLIER;
    const tokenAddress = data.tokenAddress || null;
    const payload = { StartLottery: { ...data, duration, tokenAddress } };

    sendMessage(payload, { onSuccess: resetForm });
  };

  useEffect(() => {
    if (!isFungibleToken) setFieldValue('tokenAddress', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFungibleToken]);

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <div className={styles.inputs}>
        <div className={styles.inputWrapper}>
          <Input
            type="number"
            className={styles.input}
            label="Lottery duration (minutes)"
            {...getInputProps('duration')}
          />
          <p className={styles.error}>{errors.duration}</p>
        </div>
        <div className={styles.inputWrapper}>
          <Input type="number" className={styles.input} label="Prize fund" {...getInputProps('prizeFund')} />
          <p className={styles.error}>{errors.prizeFund}</p>
        </div>
        <div className={styles.inputWrapper}>
          <Input
            type="number"
            className={styles.input}
            label="Cost of participation"
            {...getInputProps('participationCost')}
          />
          <p className={styles.error}>{errors.participationCost}</p>
        </div>
        <div className={styles.token}>
          <div className={checkboxClassName}>
            <Checkbox label="Fungible token" checked={isFungibleToken} onChange={toggleToken} />
          </div>
          {isFungibleToken && (
            <div className={styles.inputWrapper}>
              <Input className={styles.input} label="Address" {...getInputProps('tokenAddress')} />
              <p className={styles.error}>{errors.tokenAddress}</p>
            </div>
          )}
        </div>
      </div>
      <Button type="submit" text="Submit and start" />
    </form>
  );
}

export { Form };
