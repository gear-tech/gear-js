import { Button, Modal } from '@gear-js/ui';
import { HexString } from '@gear-js/api';
import { z } from 'zod';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { Form, Input, ValueField, Checkbox, withDeprecatedFallback } from '@/shared/ui';

import { ADDRESS_SCHEMA, DEFAULT_VALUES } from '../../consts';
import { useBalanceSchema, useDurationSchema, useIssueVoucher } from '../../hooks';
import { IssueVoucherModalDeprecated } from './issue-voucher-modal-deprecated';
import styles from './issue-voucher-modal.module.scss';

type Props = {
  programId: HexString;
  close: () => void;
};

const IssueVoucherModal = withDeprecatedFallback(({ programId, close }: Props) => {
  const { issueVoucher } = useIssueVoucher();

  const balanceSchema = useBalanceSchema();
  const durationSchema = useDurationSchema();

  const schema = z.object({
    address: ADDRESS_SCHEMA,
    value: balanceSchema,
    duration: durationSchema,
    isCodeUploadEnabled: z.boolean(),
  });

  type Values = typeof DEFAULT_VALUES;
  type Schema = z.infer<typeof schema>;

  const handleSubmit = ({ address, value, duration, isCodeUploadEnabled }: Schema) =>
    issueVoucher(address, programId, value, duration, isCodeUploadEnabled, close);

  return (
    <Modal heading="Create Voucher" size="large" close={close}>
      <Form<Values, Schema>
        defaultValues={DEFAULT_VALUES}
        schema={schema}
        onSubmit={handleSubmit}
        className={styles.form}>
        <Input name="address" label="Account address" direction="y" block />
        <ValueField name="value" label="Tokens amount:" direction="y" block />
        <Input type="number" name="duration" label="Duration (blocks)" direction="y" block />
        <Checkbox name="isCodeUploadEnabled" label="Allow code upload" />

        <div className={styles.buttons}>
          <Button type="submit" icon={ApplySVG} size="large" text="Create" />
          <Button icon={CloseSVG} color="light" size="large" text="Close" onClick={close} />
        </div>
      </Form>
    </Modal>
  );
}, IssueVoucherModalDeprecated);

export { IssueVoucherModal };
