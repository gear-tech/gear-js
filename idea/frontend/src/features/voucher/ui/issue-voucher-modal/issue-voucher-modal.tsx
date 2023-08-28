import { Button, Input, Modal } from '@gear-js/ui';
import { HexString } from '@gear-js/api';
import { useForm } from '@mantine/form';

import { ReactComponent as ApplySVG } from 'shared/assets/images/actions/apply.svg';
import { isExists, isHexValid } from 'shared/helpers';

import { useIssueVoucher } from '../../hooks';
import styles from './issue-voucher-modal.module.scss';

type Props = {
  programId: HexString;
  close: () => void;
};

const initialValues = { address: '' as HexString, value: '' };
const validate = { address: isHexValid, value: isExists };

const IssueVoucherModal = ({ programId, close }: Props) => {
  const { getInputProps, onSubmit } = useForm({ initialValues, validate });

  const issueVoucher = useIssueVoucher();

  const handleSubmit = onSubmit(({ address, value }) => issueVoucher(address, programId, value));

  return (
    <Modal heading="Create Voucher" close={close}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Account address:" direction="y" block {...getInputProps('address')} />
        <Input label="Tokens amount:" direction="y" block {...getInputProps('value')} />

        <Button type="submit" icon={ApplySVG} text="Create" block />
      </form>
    </Modal>
  );
};

export { IssueVoucherModal };
