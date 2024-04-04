import { Button, Radio, Modal } from '@gear-js/ui';
import { HexString } from '@gear-js/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { Input, ValueField, withDeprecatedFallback } from '@/shared/ui';

import { ADDRESS_SCHEMA, DEFAULT_VALUES, FIELD_NAME, VOUCHER_TYPE } from '../../consts';
import { useBalanceSchema, useDurationSchema, useIssueVoucher, useVoucherType } from '../../hooks';
import { Values } from '../../types';
import { DurationForm } from '../duration-form';
import { ProgramsForm } from '../programs-form';
import { IssueVoucherModalDeprecated } from './issue-voucher-modal-deprecated';
import styles from './issue-voucher-modal.module.scss';

type Props = {
  programId?: HexString;
  close: () => void;
};

const IssueVoucherModal = withDeprecatedFallback(({ programId, close }: Props) => {
  const balanceSchema = useBalanceSchema();
  const durationSchema = useDurationSchema();

  const schema = z.object({
    [FIELD_NAME.ACCOUNT_ADDRESS]: ADDRESS_SCHEMA,
    [FIELD_NAME.VALUE]: balanceSchema,
    [FIELD_NAME.DURATION]: durationSchema,
  });

  type Schema = z.infer<typeof schema>;

  const form = useForm<Values, unknown, Schema>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(schema),
  });

  const [voucherType, getVoucherTypeProps] = useVoucherType();

  const isForSpecificProgram = Boolean(programId);
  const defaultPrograms = useMemo(() => (programId ? [programId] : []), [programId]);
  const [programs, setPrograms] = useState<HexString[]>(defaultPrograms);

  const isCodeVoucher = voucherType === VOUCHER_TYPE.CODE;
  const duration = form.watch(FIELD_NAME.DURATION);
  const setDuration = (value: string) => form.setValue(FIELD_NAME.DURATION, value);

  const { issueVoucher } = useIssueVoucher();

  useEffect(() => {
    form.reset();
    setPrograms(defaultPrograms);
  }, [voucherType, form, defaultPrograms]);

  const handleSubmit = ({ address, value, duration: _duration }: Schema) => {
    const isCodeUploadEnabled = voucherType !== VOUCHER_TYPE.PROGRAM;
    const _programs = isCodeVoucher ? undefined : programs;

    issueVoucher(address, _programs, value, _duration, isCodeUploadEnabled, close);
  };

  return (
    <Modal heading="Create Voucher" size="large" close={close}>
      {!isForSpecificProgram && (
        <div className={styles.radios}>
          <Radio {...getVoucherTypeProps('Interact with a program', VOUCHER_TYPE.PROGRAM)} />
          <Radio {...getVoucherTypeProps('Interact with a program and upload a code', VOUCHER_TYPE.MIXED)} />
          <Radio {...getVoucherTypeProps('Code upload only', VOUCHER_TYPE.CODE)} />
        </div>
      )}

      {!isCodeVoucher && !isForSpecificProgram && <ProgramsForm value={programs} onChange={setPrograms} />}

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className={styles.inputs}>
            <Input name={FIELD_NAME.ACCOUNT_ADDRESS} label="Account address:" direction="y" block />
            <ValueField name={FIELD_NAME.VALUE} label="Tokens amount:" direction="y" block />

            <div className={styles.duration}>
              <h4 className={styles.heading}>Enter expiration period</h4>
              <p className={styles.subheading}>
                Specify the duration in blocks or choose from the available time intervals.
              </p>

              <DurationForm value={duration} onChange={setDuration} />
            </div>
          </div>

          <div className={styles.buttons}>
            <Button type="submit" icon={ApplySVG} size="large" text="Create" />
            <Button icon={CloseSVG} color="light" size="large" text="Close" onClick={close} />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}, IssueVoucherModalDeprecated);

export { IssueVoucherModal };
