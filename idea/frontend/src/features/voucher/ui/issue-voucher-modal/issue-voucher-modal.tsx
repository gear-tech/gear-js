import { Button, Input, Modal } from '@gear-js/ui';
import { HexString, decodeAddress } from '@gear-js/api';
import { useForm } from '@mantine/form';

import { ReactComponent as ApplySVG } from 'shared/assets/images/actions/apply.svg';
import { isAccountAddressValid, isExists } from 'shared/helpers';

import { useIssueVoucher } from '../../hooks';
import styles from './issue-voucher-modal.module.scss';

type Props = {
  programId: HexString;
  close: () => void;
};

const initialValues = { address: '', value: '' };
const validate = { address: isAccountAddressValid, value: isExists };

const IssueVoucherModal = ({ programId, close }: Props) => {
  const { getInputProps, onSubmit } = useForm({ initialValues, validate });

  const issueVoucher = useIssueVoucher();

  const handleSubmit = onSubmit(({ address, value }) => issueVoucher(decodeAddress(address), programId, value, close));

  return (
    <Modal heading="Create Voucher" close={close}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Account address:" direction="y" block {...getInputProps('address')} />
        <Input type="number" label="Tokens amount:" direction="y" block {...getInputProps('value')} />

        <Button type="submit" icon={ApplySVG} text="Create" block />
      </form>
    </Modal>
  );
};

export { IssueVoucherModal };
