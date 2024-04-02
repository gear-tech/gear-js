import { Button, Modal, Radio } from '@gear-js/ui';
import { HexString } from '@gear-js/api';
import { z } from 'zod';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { Form, Input, ValueField, withDeprecatedFallback } from '@/shared/ui';

import { useBalanceSchema, useDurationSchema, useIssueVoucher, useProgramIdSchema, useVoucherType } from './hooks';
import { IssueVoucherModalDeprecated } from './issue-voucher-modal-deprecated';
import styles from './issue-voucher-modal.module.scss';
import { ADDRESS_SCHEMA, DEFAULT_VALUES, INPUT_NAME, VOUCHER_TYPE } from './consts';

type Props = {
  programId: HexString; // TODO: drop
  close: () => void;
};

const IssueVoucherModal = withDeprecatedFallback(({ close }: Props) => {
  const { issueVoucher } = useIssueVoucher();

  const [voucherType, getVoucherTypeProps] = useVoucherType();

  const balanceSchema = useBalanceSchema();
  const durationSchema = useDurationSchema();
  const programIdSchema = useProgramIdSchema();

  const schema = z.object({
    [INPUT_NAME.PROGRAM_ID]: programIdSchema,
    [INPUT_NAME.ACCOUNT_ADDRESS]: ADDRESS_SCHEMA,
    [INPUT_NAME.VALUE]: balanceSchema,
    [INPUT_NAME.DURATION]: durationSchema,
  });

  type Values = typeof DEFAULT_VALUES;
  type Schema = z.infer<typeof schema>;

  const handleSubmit = ({ address, programId, value, duration }: Schema) => {
    const isCodeUploadEnabled = voucherType !== VOUCHER_TYPE.PROGRAM;

    issueVoucher(address, programId, value, duration, isCodeUploadEnabled, close);
  };

  return (
    <Modal heading="Create Voucher" size="large" close={close}>
      <Form<Values, Schema>
        defaultValues={DEFAULT_VALUES}
        schema={schema}
        onSubmit={handleSubmit}
        className={styles.form}>
        <div className={styles.radios}>
          <Radio {...getVoucherTypeProps('Interact with a program', VOUCHER_TYPE.PROGRAM)} />
          <Radio {...getVoucherTypeProps('Interact with a program and upload a code', VOUCHER_TYPE.MIXED)} />
          <Radio {...getVoucherTypeProps('Code upload only', VOUCHER_TYPE.CODE)} />
        </div>

        {voucherType !== VOUCHER_TYPE.CODE && (
          <Input name={INPUT_NAME.PROGRAM_ID} label="Program ID:" direction="y" block />
        )}

        <Input name={INPUT_NAME.ACCOUNT_ADDRESS} label="Account address:" direction="y" block />
        <ValueField name={INPUT_NAME.VALUE} label="Tokens amount:" direction="y" block />
        <Input type="number" name={INPUT_NAME.DURATION} label="Duration (blocks):" direction="y" block />

        <div className={styles.buttons}>
          <Button type="submit" icon={ApplySVG} size="large" text="Create" />
          <Button icon={CloseSVG} color="light" size="large" text="Close" onClick={close} />
        </div>
      </Form>
    </Modal>
  );
}, IssueVoucherModalDeprecated);

export { IssueVoucherModal };
