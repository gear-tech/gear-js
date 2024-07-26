import { useApi } from '@gear-js/react-hooks';
import { Button, Modal } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { Checkbox, Input, ValueField } from '@/shared/ui';
import { useBalanceSchema, useSignAndSend } from '@/hooks';
import { ACCOUNT_ADDRESS_SCHEMA } from '@/shared/config';

import SubmitSVG from '../../assets/submit.svg?react';
import styles from './transfer-balance-modal.module.scss';

const FIELD_NAME = {
  ADDRESS: 'address',
  VALUE: 'value',
  KEEP_ALIVE: 'keepAlive',
} as const;

const DEFAULT_VALUES = {
  [FIELD_NAME.VALUE]: '',
  [FIELD_NAME.KEEP_ALIVE]: true,
};

function useSchema() {
  const balanceSchema = useBalanceSchema();

  return z.object({
    // address can be a program id too, but we don't need to validate it's existence. account address schema should do the work
    [FIELD_NAME.ADDRESS]: ACCOUNT_ADDRESS_SCHEMA,
    [FIELD_NAME.VALUE]: balanceSchema,
    [FIELD_NAME.KEEP_ALIVE]: z.boolean(),
  });
}

type Props = {
  defaultAddress?: string;
  close: () => void;
};

const TransferBalanceModal = ({ defaultAddress = '', close }: Props) => {
  const { api, isApiReady } = useApi();
  const signAndSend = useSignAndSend();

  const schema = useSchema();

  const form = useForm({
    defaultValues: { ...DEFAULT_VALUES, [FIELD_NAME.ADDRESS]: defaultAddress },
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit(({ address, value, keepAlive }) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const onSuccess = close;

    const extrinsic = keepAlive
      ? api.tx.balances.transferKeepAlive(address, value)
      : api.tx.balances.transferAllowDeath(address, value);

    signAndSend(extrinsic, 'Transfer', { onSuccess });
  });

  return (
    <Modal heading="Transfer Balance" size="large" close={close}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputs}>
            <Input name={FIELD_NAME.ADDRESS} label="Address" direction="y" block />
            <ValueField name={FIELD_NAME.VALUE} label="Value" direction="y" block />
            <Checkbox name={FIELD_NAME.KEEP_ALIVE} label="Keep Alive" />
          </div>

          <div className={styles.buttons}>
            <Button type="submit" icon={SubmitSVG} text="Send" size="large" />
            <Button icon={CloseSVG} text="Close" size="large" color="light" onClick={close} />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export { TransferBalanceModal };
