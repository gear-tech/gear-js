import { Button, Input, Modal } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { useModal } from 'hooks';

import { ReactComponent as TransferBalanceSVG } from 'shared/assets/images/actions/transferBalanceSubmit.svg';
import { isExists } from 'shared/helpers';

import styles from './TransferBalanceModal.module.scss';

const initialValues = { address: '', amount: '' };
const validate = { address: isExists, amount: (value: string) => (+value > 0 ? null : 'Number is not valid') };

type Props = {
  onSubmit: (to: string, value: number) => void;
};

const TransferBalanceModal = ({ onSubmit }: Props) => {
  const form = useForm({ initialValues, validate });
  const { getInputProps } = form;

  const { closeModal } = useModal();

  const handleSubmit = form.onSubmit(({ address, amount }) => onSubmit(address, +amount));

  return (
    <Modal heading="Transfer Balance" close={closeModal}>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputs}>
          <Input label="Address" direction="y" {...getInputProps('address')} />
          <Input type="number" label="Amount" direction="y" {...getInputProps('amount')} />
        </div>

        <Button type="submit" text="Send" icon={TransferBalanceSVG} block />
      </form>
    </Modal>
  );
};

export { TransferBalanceModal };
