import { useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import { Button, Modal } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { web3FromSource } from '@polkadot/extension-dapp';
import { FormProvider, useForm } from 'react-hook-form';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { Input } from '@/shared/ui';

import { DEFAULT_VALUES, FIELD_NAME, DnsSchema, dnsSchema } from '../../consts';
import { useLoading } from '../../hooks';
import { Values } from '../../types';
import { AddNewProgram } from '../../sails';

import styles from './create-dns-modal.module.scss';

type Props = {
  close: () => void;
  onSubmit?: () => void;
  initialValues?: DnsSchema;
};

const CreateDnsModal = ({ close, onSubmit = () => {}, initialValues }: Props) => {
  const { account } = useAccount();
  const alert = useAlert();

  const [isLoading, enableLoading, disableLoading] = useLoading();

  const form = useForm<Values, unknown, DnsSchema>({
    defaultValues: initialValues || DEFAULT_VALUES,
    resolver: zodResolver(dnsSchema),
  });

  const handleSubmit = async ({ name, address }: DnsSchema) => {
    if (account) {
      try {
        enableLoading();
        await AddNewProgram(account, name, address);

        onSubmit();
        close();
      } catch (error) {
        const errorMessage = (error as Error).message;
        alert.error(errorMessage);
      } finally {
        disableLoading();
      }
    }
  };

  return (
    <Modal heading="Create DNS" size="large" close={close}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className={styles.inputs}>
            <Input name={FIELD_NAME.DNS_NAME} label="Name:" direction="y" block />
            <Input name={FIELD_NAME.DNS_ADDRESS} label="Program address:" direction="y" block />
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

export { CreateDnsModal };
