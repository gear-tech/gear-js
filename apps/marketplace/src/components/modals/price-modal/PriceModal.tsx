import { Button, Input, Modal } from '@gear-js/ui';
import { ChangeEvent, FormEvent, useState } from 'react';
import styles from '../index.module.scss';

type Props = {
  heading: string;
  close: () => void;
  onSubmit: (value: string, onSuccess: () => void) => void;
};

function PriceModal({ heading, close, onSubmit }: Props) {
  const [price, setPrice] = useState('');
  const handlePriceChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setPrice(value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Number(price) > 0) onSubmit(price, close);
  };

  return (
    <Modal heading={heading} close={close}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input type="number" value={price} onChange={handlePriceChange} />
        <Button type="submit" text="OK" block />
      </form>
    </Modal>
  );
}

export { PriceModal };
