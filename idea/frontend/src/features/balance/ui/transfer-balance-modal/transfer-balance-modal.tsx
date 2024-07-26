import { useAccount } from '@gear-js/react-hooks';
import { Button, Modal } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { Checkbox, Input, ValueField } from '@/shared/ui';
import { useBalanceTransfer, useBalanceSchema } from '@/hooks';
import { ACCOUNT_ADDRESS_SCHEMA } from '@/shared/config';

import SubmitSVG from '../../assets/submit.svg?react';
import styles from './transfer-balance-modal.module.scss';

const FIELD_NAME = {
  ADDRESS: 'address',
  VALUE: 'value',
  KEEP_ALIVE: 'keepAlive',
} as const;

const DEFAULT_VALUES = {
  [FIELD_NAME.ADDRESS]: '',
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
  close: () => void;
};

const TransferBalanceModal = ({ close }: Props) => {
  const { account } = useAccount();
  const transferBalance = useBalanceTransfer();

  const schema = useSchema();
  const form = useForm({ defaultValues: DEFAULT_VALUES, resolver: zodResolver(schema) });

  const handleSubmit = form.handleSubmit(({ address, value, keepAlive }) => {
    if (!account) throw new Error('Account is not found');

    const signSource = account.meta.source;
    const onSuccess = close;
    transferBalance(account.address, address, value, { keepAlive, signSource, onSuccess });
  });

  return (
    <Modal heading="Transfer Balance" size="large" close={close}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputs}>
            <Input name={FIELD_NAME.ADDRESS} label="Address" direction="y" block />
            <ValueField name={FIELD_NAME.VALUE} label="Value:" direction="y" block />
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
