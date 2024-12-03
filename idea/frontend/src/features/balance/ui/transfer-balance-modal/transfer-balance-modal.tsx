import { useAccount, useApi, useDeriveBalancesAll } from '@gear-js/react-hooks';
import { Button, Modal } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { Checkbox, Input, ValueField } from '@/shared/ui';
import { useBalanceSchema, useLoading, useSignAndSend } from '@/hooks';
import { ACCOUNT_ADDRESS_SCHEMA } from '@/shared/config';

import SubmitSVG from '../../assets/submit.svg?react';
import { Balance } from '../balance';
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
  onClose: () => void;
};

const TransferBalanceModal = ({ defaultAddress = '', onClose }: Props) => {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const { data: balance } = useDeriveBalancesAll({ address: account?.address });

  const [isLoading, enableLoading, disableLoading] = useLoading();
  const signAndSend = useSignAndSend();

  const schema = useSchema();

  const form = useForm({
    defaultValues: { ...DEFAULT_VALUES, [FIELD_NAME.ADDRESS]: defaultAddress },
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit(({ address, value, keepAlive }) => {
    if (!isApiReady) throw new Error('API is not initialized');

    enableLoading();

    const onSuccess = onClose;
    const onError = disableLoading;

    const extrinsic = keepAlive
      ? api.tx.balances.transferKeepAlive(address, value)
      : api.tx.balances.transferAllowDeath(address, value);

    signAndSend(extrinsic, 'Transfer', { onSuccess, onError });
  });

  return (
    <Modal heading="Transfer Balance" size="large" close={onClose}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputs}>
            <Input name={FIELD_NAME.ADDRESS} label="Address" direction="y" block />

            <div>
              <ValueField name={FIELD_NAME.VALUE} label="Value" direction="y" block />

              <div className={styles.balance}>
                <p className={styles.text}>Your transferable balance:</p>
                <Balance value={balance?.transferable || balance?.availableBalance} variant="secondary" />
              </div>
            </div>

            <Checkbox name={FIELD_NAME.KEEP_ALIVE} label="Keep Alive" />
          </div>

          <div className={styles.buttons}>
            <Button type="submit" icon={SubmitSVG} text="Send" size="large" disabled={isLoading} />
            <Button icon={CloseSVG} text="Close" size="large" color="light" onClick={onClose} />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export { TransferBalanceModal };
