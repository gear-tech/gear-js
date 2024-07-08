import { Button, Modal } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { Input } from '@/shared/ui';

import { DEFAULT_VALUES, FIELD_NAME } from '../../consts';
import { Values } from '../../types';
import { useDnsActions, useDnsSchema } from '../../hooks';

import styles from './dns-modal.module.scss';
import clsx from 'clsx';

type Props = {
  close: () => void;
  onSuccess: () => void;
  heading: string;
  submitText: string;
  initialValues?: Values;
};

const DnsModal = ({ heading, submitText, close, onSuccess, initialValues }: Props) => {
  const dnsSchema = useDnsSchema();
  const isEditMode = Boolean(initialValues);

  type DnsSchema = z.infer<typeof dnsSchema>;

  const form = useForm<Values, unknown, DnsSchema>({
    defaultValues: initialValues || DEFAULT_VALUES,
    resolver: zodResolver(dnsSchema),
  });

  const { isLoading, addNewProgram, changeProgramId } = useDnsActions();

  const handleSubmit = ({ name, address }: DnsSchema) => {
    const resolve = () => {
      onSuccess();
      close();
    };

    const handler = isEditMode ? changeProgramId : addNewProgram;
    handler(name, address, { resolve });
  };

  return (
    <Modal heading={heading} size="large" close={close}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className={styles.inputs}>
            <Input
              name={FIELD_NAME.DNS_NAME}
              className={clsx(isEditMode && styles.inputDisabled)}
              label={isEditMode ? 'dDNS name:' : 'Enter dDNS name:'}
              direction="y"
              placeholder="New nDNS"
              block
              disabled={isEditMode}
            />
            <Input
              name={FIELD_NAME.DNS_ADDRESS}
              label="Specify account address:"
              direction="y"
              placeholder="0x"
              block
            />
          </div>

          <div className={styles.buttons}>
            <Button type="submit" icon={ApplySVG} size="large" text={submitText} disabled={isLoading} />
            <Button icon={CloseSVG} color="light" size="large" text="Cancel" onClick={close} />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export { DnsModal };
