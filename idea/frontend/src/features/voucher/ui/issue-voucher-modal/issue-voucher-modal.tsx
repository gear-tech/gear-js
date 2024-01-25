import { useApi } from '@gear-js/react-hooks';
import { Button, Modal } from '@gear-js/ui';
import { HexString } from '@gear-js/api';
import { z } from 'zod';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { Form, Input, ValueField } from '@/shared/ui';

import { ADDRESS_SCHEMA, DEFAULT_VALUES } from '../../consts';
import { useBalanceSchema, useDurationSchema, useIssueVoucher } from '../../hooks';
import styles from './issue-voucher-modal.module.scss';

type Props = {
  programId: HexString;
  close: () => void;
};

const IssueVoucherModal = ({ programId, close }: Props) => {
  const { isV110Runtime } = useApi();
  const { issueVoucher } = useIssueVoucher();

  const balanceSchema = useBalanceSchema();
  const durationSchema = useDurationSchema();

  const schema = z.object({
    address: ADDRESS_SCHEMA,
    value: balanceSchema,
    duration: durationSchema,
  });

  type Values = typeof DEFAULT_VALUES;
  type Schema = z.infer<typeof schema>;

  const handleSubmit = ({ address, value, duration }: Schema) =>
    issueVoucher(address, programId, value, duration, close);

  return (
    <Modal heading="Create Voucher" size="large" close={close}>
      <Form<Values, Schema>
        defaultValues={DEFAULT_VALUES}
        schema={schema}
        onSubmit={handleSubmit}
        className={styles.form}>
        <Input name="address" label="Account address" direction="y" block />
        <ValueField name="value" label="Tokens amount:" direction="y" block />

        {isV110Runtime && <Input type="number" name="duration" label="Duration (blocks)" direction="y" block />}

        <div className={styles.buttons}>
          <Button type="submit" icon={ApplySVG} size="large" text="Create" />
          <Button icon={CloseSVG} color="light" size="large" text="Close" onClick={close} />
        </div>
      </Form>
    </Modal>
  );
};

export { IssueVoucherModal };
