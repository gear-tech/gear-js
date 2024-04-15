import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { Button, Checkbox, Modal } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useSignAndSend } from '@/hooks';
import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { asOptionalField } from '@/shared/helpers';
import { Input, ValueField } from '@/shared/ui';

import { ADDRESS_SCHEMA, DEFAULT_VALUES, FIELD_NAME } from '../../consts';
import { useBalanceSchema, useDurationSchema, useLoading } from '../../hooks';
import { Values, Voucher } from '../../types';
import { DurationForm } from '../duration-form';
import { ProgramsForm } from '../programs-form';
import styles from './update-voucher-modal.module.scss';

type Props = {
  voucher: Voucher;
  close: () => void;
  onSubmit: () => void;
};

const UpdateVoucherModal = ({ voucher, close, onSubmit }: Props) => {
  const { isApiReady, api } = useApi();

  const signAndSend = useSignAndSend();
  const [isLoading, enableLoading, disableLoading] = useLoading();

  const balanceSchema = useBalanceSchema();
  const durationSchema = useDurationSchema();

  const schema = z.object({
    [FIELD_NAME.ACCOUNT_ADDRESS]: asOptionalField(ADDRESS_SCHEMA),
    [FIELD_NAME.VALUE]: asOptionalField(balanceSchema),
    [FIELD_NAME.DURATION]: asOptionalField(durationSchema),
  });

  type Schema = z.infer<typeof schema>;

  const form = useForm<Values, unknown, Schema>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(schema),
  });

  const [isCodeUploadEnabled, setIsCodeUploadEnabled] = useState(voucher.codeUploading);

  const [programs, setPrograms] = useState<HexString[]>([]);

  const duration = form.watch(FIELD_NAME.DURATION);
  const setDuration = (value: string) => form.setValue(FIELD_NAME.DURATION, value, { shouldValidate: true });

  const handleSubmit = ({ address, value }: Schema) => {
    if (!isApiReady) throw new Error('API is not initialized');

    enableLoading();

    const options = {
      moveOwnership: address,
      balanceTopUp: BigInt(value),
      appendPrograms: programs,
      codeUploading: isCodeUploadEnabled,
      prolongDuration: Number(duration),
    };

    const extrinsic = api.voucher.update(voucher.spender, voucher.id, options);

    const onSuccess = () => {
      onSubmit();
      close();
    };

    const onError = disableLoading;

    signAndSend(extrinsic, 'VoucherUpdated', { onSuccess, onError });
  };

  return (
    <Modal heading="Update Voucher" size="large" close={close}>
      <div className={styles.radios}>
        <Checkbox
          type="switch"
          label="Allow code uploading"
          checked={isCodeUploadEnabled}
          onChange={() => setIsCodeUploadEnabled((prevValue) => !prevValue)}
        />
      </div>

      <ProgramsForm value={programs} voucherValue={voucher.programs} onChange={setPrograms} />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className={styles.inputs}>
            <Input
              name={FIELD_NAME.ACCOUNT_ADDRESS}
              label="Transfer ownership to account address:"
              direction="y"
              block
            />

            <ValueField name={FIELD_NAME.VALUE} label="Increase balance:" direction="y" block />

            <div className={styles.duration}>
              <h4 className={styles.heading}>Prolong expiration period</h4>
              <p className={styles.subheading}>
                Specify the duration in blocks or choose from the available time intervals. It will be added to the
                current voucher expiration time ({new Date(voucher.expiryAt).toLocaleString()}).
              </p>

              <DurationForm value={duration} onChange={setDuration} />
            </div>
          </div>

          <div className={styles.buttons}>
            <Button type="submit" icon={ApplySVG} size="large" text="Update" disabled={isLoading} />
            <Button icon={CloseSVG} color="light" size="large" text="Close" onClick={close} />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export { UpdateVoucherModal };
