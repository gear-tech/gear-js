import { Button, Input, Modal } from '@gear-js/ui';
import { ChangeEvent, FormEvent, useState } from 'react';
import styles from './PriceModal.module.scss';

type Props = {
  heading: string;
  close: () => void;
  onSubmit: (price: string) => void;
};

function PriceModal({ heading, close, onSubmit }: Props) {
  const [price, setPrice] = useState('');
  const handlePriceChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setPrice(value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Number(price) > 0) onSubmit(price);
  };

  return (
    <Modal heading={heading} close={close}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input value={price} onChange={handlePriceChange} />
        <Button type="submit" text="OK" block />
      </form>
    </Modal>
  );
}

export { PriceModal };
