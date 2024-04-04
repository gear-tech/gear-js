import { Button, Modal, Radio } from '@gear-js/ui';
import { HexString } from '@gear-js/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { Input, ValueField, withDeprecatedFallback } from '@/shared/ui';

import { ADDRESS_SCHEMA, DEFAULT_VALUES, INPUT_NAME, VOUCHER_TYPE } from '../../consts';
import { useAddProgramForm, useBalanceSchema, useDurationSchema, useIssueVoucher, useVoucherType } from '../../hooks';
import { DurationForm } from '../duration-form';
import { ProgramsForm } from '../programs-form';
import { IssueVoucherModalDeprecated } from './issue-voucher-modal-deprecated';
import styles from './issue-voucher-modal.module.scss';

type Props = {
  programId: HexString; // TODO: drop
  close: () => void;
};

const IssueVoucherModal = withDeprecatedFallback(({ close }: Props) => {
  const { issueVoucher } = useIssueVoucher();

  const balanceSchema = useBalanceSchema();
  const durationSchema = useDurationSchema();

  const schema = z.object({
    [INPUT_NAME.ACCOUNT_ADDRESS]: ADDRESS_SCHEMA,
    [INPUT_NAME.VALUE]: balanceSchema,
    [INPUT_NAME.DURATION]: durationSchema,
  });

  type Values = typeof DEFAULT_VALUES;
  type Schema = z.infer<typeof schema>;

  const form = useForm<Values, unknown, Schema>({ defaultValues: DEFAULT_VALUES, resolver: zodResolver(schema) });

  const [voucherType, getVoucherTypeProps] = useVoucherType();
  const { form: addProgramForm, fieldArray: addProgramFieldArray } = useAddProgramForm();

  useEffect(() => {
    form.reset();
    addProgramForm.reset();
  }, [voucherType, form, addProgramForm]);

  const handleSubmit = ({ address, value, duration }: Schema) => {
    const isCodeUploadEnabled = voucherType !== VOUCHER_TYPE.PROGRAM;
    const programs =
      voucherType !== VOUCHER_TYPE.CODE ? addProgramFieldArray.fields.map((field) => field.value) : undefined;

    console.log('duration: ', duration);
    console.log('programs: ', programs);

    // issueVoucher(address, programs, value, duration, isCodeUploadEnabled, close);
  };

  const duration = form.watch(INPUT_NAME.DURATION);
  const durationSelect = form.watch(INPUT_NAME.DURATION_SELECT);
  const setDuration = (value: string) => form.setValue(INPUT_NAME.DURATION, value as '');

  useEffect(() => {
    form.setValue(INPUT_NAME.DURATION_SELECT, duration);
  }, [duration]);

  useEffect(() => {
    setDuration(durationSelect);
  }, [durationSelect]);

  return (
    <Modal heading="Create Voucher" size="large" close={close} className={styles.form}>
      <div className={styles.radios}>
        <Radio {...getVoucherTypeProps('Interact with a program', VOUCHER_TYPE.PROGRAM)} />
        <Radio {...getVoucherTypeProps('Interact with a program and upload a code', VOUCHER_TYPE.MIXED)} />
        <Radio {...getVoucherTypeProps('Code upload only', VOUCHER_TYPE.CODE)} />
      </div>

      {voucherType !== VOUCHER_TYPE.CODE && <ProgramsForm form={addProgramForm} fieldArray={addProgramFieldArray} />}

      <FormProvider {...form}>
        <form className={styles.form} onSubmit={form.handleSubmit(handleSubmit)}>
          <Input name={INPUT_NAME.ACCOUNT_ADDRESS} label="Account address:" direction="y" block />
          <ValueField name={INPUT_NAME.VALUE} label="Tokens amount:" direction="y" block />

          <div className={styles.duration}>
            <h4 className={styles.heading}>Enter expiration period</h4>
            <p className={styles.subheading}>
              Specify the duration in blocks or choose from the available time intervals.
            </p>

            <DurationForm duration={duration} setDuration={setDuration} />
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
