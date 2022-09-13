import { Hex } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { Input, inputStyles, Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { isHex } from '@polkadot/util';
import clsx from 'clsx';
import { ADDRESS, MULTIPLIER } from 'consts';
import { useAuctionMessage, useNftMessage, useWasm } from 'hooks';
import styles from './Form.module.scss';

const initialValues = {
  nftContractActorId: '0x2cb1532754e0883ce06b175c208d4e780da81f543106cdd45a01201c4c04808b',
  tokenId: '1',
  startingPrice: '1000',
  discountRate: '5',
  hours: '00',
  minutes: '00',
  seconds: '01',
};

const validate = {
  nftContractActorId: (value: string) => (!isHex(value) ? 'Address should be hex' : null),
  tokenId: (value: string) => (!value ? 'Field is required' : null),
  startingPrice: (value: string) => (!value ? 'Field is required' : null),
  discountRate: (value: string) => (!value ? 'Field is required' : null),
  hours: (value: string) => (+value < 0 ? "Time can't be negative" : null),
  minutes: (value: string) => (+value < 0 ? "Time can't be negative" : null),
  seconds: (value: string) => (+value < 0 ? "Time can't be negative" : null),
};

function Form() {
  const { api } = useApi();

  const { getInputProps, onSubmit, values, errors, setFieldError } = useForm({ initialValues, validate });
  const { nftContractActorId, tokenId, hours, minutes, seconds } = values;

  const sendAuctionMessage = useAuctionMessage();
  const { auction } = useWasm();

  const sendNftMessage = useNftMessage(nftContractActorId as Hex);

  const createAuction = () => sendAuctionMessage({ Create: { duration: { hours, minutes, seconds }, ...values } });
  const approveTokenAndCreateAuction = () =>
    sendNftMessage({ Approve: { to: auction.programId, tokenId } }, { onSuccess: createAuction });

  const getSeconds = () => {
    const hourSeconds = +hours * MULTIPLIER.MINUTES * MULTIPLIER.SECONDS;
    const minuteSeconds = +minutes * MULTIPLIER.SECONDS;

    return hourSeconds + minuteSeconds + +seconds;
  };

  const price = +values.startingPrice - getSeconds() * +values.discountRate;
  const priceClassName = clsx(styles.price, price > 0 && styles.success, price < 0 && styles.error);

  const isNftContractAddressValid = () => api.program.exists(nftContractActorId as Hex);

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
            <Input type="number" min="0" label="Hours" className={styles.input} {...getInputProps('hours')} />
            <Input type="number" min="0" label="Minutes" className={styles.input} {...getInputProps('minutes')} />
            <Input type="number" min="0" label="Seconds" className={styles.input} {...getInputProps('seconds')} />
          </div>
          <p className={styles.error}>{errors.hours || errors.minutes || errors.seconds}</p>
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
