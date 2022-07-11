import { Button, Input, Modal } from '@gear-js/ui';
import { ChangeEvent, FormEvent, useState } from 'react';
import { modalStyles } from 'components/modals';
import { AuctionFormValues } from 'types';

type Props = {
  close: () => void;
  onSubmit: (values: AuctionFormValues, onSuccess: () => void) => void;
};

function AuctionModal({ close, onSubmit }: Props) {
  const [values, setValues] = useState({ minPrice: '', duration: '', bidPeriod: '' });
  const { minPrice, duration, bidPeriod } = values;

  const handleChange = ({ target: { value, name } }: ChangeEvent<HTMLInputElement>) => {
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (minPrice && duration && bidPeriod) onSubmit(values, close);
  };

  return (
    <Modal heading="Auction" close={close}>
      <form className={modalStyles.form} onSubmit={handleSubmit}>
        <Input type="number" placeholder="min price" name="minPrice" value={minPrice} onChange={handleChange} />
        <Input type="number" placeholder="duration (min)" name="duration" value={duration} onChange={handleChange} />
        <Input
          type="number"
          placeholder="bid period (min)"
          name="bidPeriod"
          value={bidPeriod}
          onChange={handleChange}
        />
        <Button type="submit" text="Start auction" block />
      </form>
    </Modal>
  );
}

export { AuctionModal };
