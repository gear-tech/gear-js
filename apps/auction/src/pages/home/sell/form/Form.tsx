import { Input, inputStyles, Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { useAuctionMessage } from 'hooks';
import styles from './Form.module.scss';

const initialValues = {
  nftContractActorId: '',
  tokenId: '',
  startingPrice: '',
  discountRate: '',
  days: '',
  hours: '',
  minutes: '',
};

function Form() {
  const { getInputProps, onSubmit } = useForm({ initialValues });
  const sendMessage = useAuctionMessage();

  const handleSubmit = ({ days, hours, minutes, ...values }: typeof initialValues) => {
    const duration = { days, hours, minutes };
    const payload = { Create: { duration, ...values } };

    sendMessage(payload);
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <div className={styles.inputs}>
        <div className={styles.row}>
          <Input type="number" label="Days" className={styles.input} {...getInputProps('days')} />
          <Input type="number" label="Hours" className={styles.input} {...getInputProps('hours')} />
          <Input type="number" label="Minutes" className={styles.input} {...getInputProps('minutes')} />
        </div>
        <Input label="NFT contract address" className={styles.input} {...getInputProps('nftContractActorId')} />
        <Input type="number" label="Token ID" className={styles.input} {...getInputProps('tokenId')} />
        <div className={styles.row}>
          <Input type="number" label="Start price" className={styles.input} {...getInputProps('startingPrice')} />
          <Input
            type="number"
            label="Discount rate per ms"
            className={styles.input}
            {...getInputProps('discountRate')}
          />
        </div>
        <p>
          <span className={inputStyles.label}>Final price:</span>
          <span className={styles.price}>00.00</span>
        </p>
      </div>
      <Button type="submit" text="Sell NFT" block />
    </form>
  );
}

export { Form };
