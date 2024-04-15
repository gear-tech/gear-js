import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { Button, Radio, Modal } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useSignAndSend } from '@/hooks';
import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { Input, ValueField } from '@/shared/ui';

import { ADDRESS_SCHEMA, DEFAULT_VALUES, FIELD_NAME, VOUCHER_TYPE } from '../../consts';
import { useBalanceSchema, useDurationSchema, useVoucherType, useLoading } from '../../hooks';
import { Values } from '../../types';
import { DurationForm } from '../duration-form';
import { ProgramsForm } from '../programs-form';
import styles from './issue-voucher-modal.module.scss';

type Props = {
  programId?: HexString;
  close: () => void;
  onSubmit?: () => void;
};

const IssueVoucherModal = ({ programId, close, onSubmit = () => {} }: Props) => {
  const { isApiReady, api } = useApi();

  const signAndSend = useSignAndSend();
  const [isLoading, enableLoading, disableLoading] = useLoading();

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

  const defaultPrograms = useMemo(() => (programId ? [programId] : []), [programId]);
  const [programs, setPrograms] = useState(defaultPrograms);

  const isCodeVoucher = voucherType === VOUCHER_TYPE.CODE;
  const duration = form.watch(FIELD_NAME.DURATION);
  const setDuration = (value: string) => form.setValue(FIELD_NAME.DURATION, value, { shouldValidate: true });

  useEffect(() => {
    form.reset();
    setPrograms(defaultPrograms);
  }, [voucherType, form, defaultPrograms]);

  const handleSubmit = async ({ address, value }: Schema) => {
    if (!isApiReady) throw new Error('API is not initialized');

    enableLoading();

    const isCodeUploadEnabled = voucherType !== VOUCHER_TYPE.PROGRAM;
    const programIds = isCodeVoucher ? undefined : programs;

    const { extrinsic } = await api.voucher.issue(address, value, Number(duration), programIds, isCodeUploadEnabled);

    const onSuccess = () => {
      onSubmit();
      close();
    };

    const onError = disableLoading;

    signAndSend(extrinsic, 'VoucherIssued', { onSuccess, onError });
  };

  return (
    <Modal heading="Create Voucher" size="large" close={close}>
      <div className={styles.radios}>
        <Radio {...getVoucherTypeProps('Interact with a program', VOUCHER_TYPE.PROGRAM)} />
        <Radio {...getVoucherTypeProps('Interact with a program and upload a code', VOUCHER_TYPE.MIXED)} />
        <Radio {...getVoucherTypeProps('Code upload only', VOUCHER_TYPE.CODE)} />
      </div>

      {!isCodeVoucher && <ProgramsForm value={programs} onChange={setPrograms} />}

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
            <Button type="submit" icon={ApplySVG} size="large" text="Create" disabled={isLoading} />
            <Button icon={CloseSVG} color="light" size="large" text="Close" onClick={close} />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export { IssueVoucherModal };
