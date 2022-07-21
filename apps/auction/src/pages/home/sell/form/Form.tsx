import { Hex } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { Input, inputStyles, Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { isHex } from '@polkadot/util';
import clsx from 'clsx';
import { ADDRESS, MULTIPLIER } from 'consts';
import { useAuctionMessage, useNftMessage } from 'hooks';
import styles from './Form.module.scss';

const initialValues = {
  nftContractActorId: '0xf9be5c25e821bc7abc546a90104dab55774fd49981d1128e1a0f5c0a92d650db',
  tokenId: '0',
  startingPrice: '1000',
  discountRate: '5',
  days: '00',
  hours: '00',
  minutes: '01',
};

const validate = {
  nftContractActorId: (value: string) => (!isHex(value) ? 'Address should be hex' : null),
  tokenId: (value: string) => (!value ? 'Field is required' : null),
  startingPrice: (value: string) => (!value ? 'Field is required' : null),
  discountRate: (value: string) => (!value ? 'Field is required' : null),
  days: (value: string) => (+value < 0 ? "Time can't be negative" : null),
  hours: (value: string) => (+value < 0 ? "Time can't be negative" : null),
  minutes: (value: string) => (+value < 0 ? "Time can't be negative" : null),
};

function Form() {
  const { api } = useApi();

  const { getInputProps, onSubmit, values, errors, setFieldError } = useForm({ initialValues, validate });
  const { nftContractActorId, tokenId, days, hours, minutes } = values;

  const sendAuctionMessage = useAuctionMessage();
  const sendNftMessage = useNftMessage(nftContractActorId as Hex);

  const createAuction = () => sendAuctionMessage({ Create: { duration: { days, hours, minutes }, ...values } });
  const approveTokenAndCreateAuction = () =>
    sendNftMessage({ Approve: { to: ADDRESS.AUCTION_CONTRACT, tokenId } }, { onSuccess: createAuction });

  // const getSeconds = () => {
  //   const { hours, minutes, seconds } = values;

  //   const hourSeconds = +hours * MULTIPLIER.MINUTES * MULTIPLIER.SECONDS;
  //   const minuteSeconds = +minutes * MULTIPLIER.SECONDS;

  //   return hourSeconds + minuteSeconds + seconds;
  // };

  const price = +values.startingPrice - +values.minutes * MULTIPLIER.SECONDS * +values.discountRate;
  const priceClassName = clsx(styles.price, price > 0 && styles.success, price < 0 && styles.error);

  const isNftContractAddressValid = async () => api.program.exists(nftContractActorId as Hex);

  const handleSubmit = async () => {
    if (price < 0) {
      setFieldError('startingPrice', 'Final price should be bigger or equal 0');
    } else if (await isNftContractAddressValid()) {
      approveTokenAndCreateAuction();
    } else {
      setFieldError('nftContractActorId', 'Program is not found in the storage');
    }
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <div className={styles.inputs}>
        <div>
          <div className={styles.row}>
            <Input type="number" min="0" label="Days" className={styles.input} {...getInputProps('days')} />
            <Input type="number" min="0" label="Hours" className={styles.input} {...getInputProps('hours')} />
            <Input type="number" min="0" label="Minutes" className={styles.input} {...getInputProps('minutes')} />
          </div>
          <p className={styles.error}>{errors.days || errors.hours || errors.minutes}</p>
        </div>
        <div>
          <Input label="NFT contract address" className={styles.input} {...getInputProps('nftContractActorId')} />
          <p className={styles.error}>{errors.nftContractActorId}</p>
        </div>
        <div>
          <Input type="number" min="0" label="Token ID" className={styles.input} {...getInputProps('tokenId')} />
          <p className={styles.error}>{errors.tokenId}</p>
        </div>
        <div>
          <div className={styles.row}>
            <Input
              type="number"
              min="0"
              label="Start price"
              className={styles.input}
              {...getInputProps('startingPrice')}
            />
            <Input
              type="number"
              min="0"
              label="Discount rate per second"
              className={styles.input}
              {...getInputProps('discountRate')}
            />
          </div>
          <p className={styles.error}>{errors.startingPrice || errors.discountRate}</p>
        </div>
        <p>
          <span className={inputStyles.label}>Final price:</span>
          <span className={priceClassName}>{price}</span>
        </p>
      </div>
      <Button type="submit" text="Sell NFT" block />
    </form>
  );
}

export { Form };
