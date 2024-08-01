import { Button, Modal } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { Input } from '@/shared/ui';

import { DEFAULT_VALUES, FIELD_NAME, FUNCTION_NAME } from '../../consts';
import { Values } from '../../types';
import { useDnsSchema, useSendDnsTransaction } from '../../hooks';
import styles from './dns-modal.module.scss';

type Props = {
  close: () => void;
  onSuccess: () => void;
  heading: string;
  submitText: string;
  initialValues?: Values;
};

const DnsModal = ({ heading, submitText, close, onSuccess, initialValues }: Props) => {
  const isEditMode = Boolean(initialValues);
  const dnsSchema = useDnsSchema(isEditMode);

  const form = useForm<Values, unknown, z.infer<typeof dnsSchema>>({
    defaultValues: initialValues || DEFAULT_VALUES,
    resolver: zodResolver(dnsSchema, { async: true }),
  });

  const addProgram = useSendDnsTransaction(FUNCTION_NAME.ADD_PROGRAM);
  const changeProgramId = useSendDnsTransaction(FUNCTION_NAME.CHANGE_PROGRAM_ID);
  const { sendTransaction, isLoading } = isEditMode ? changeProgramId : addProgram;

  const handleSubmit = form.handleSubmit(({ name, address }) => {
    const _onSuccess = () => {
      onSuccess();
      close();
    };

    sendTransaction([name, address], _onSuccess);
  });

  return (
    <Modal heading={heading} size="large" close={close}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit}>
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
              label="Specify program address:"
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
