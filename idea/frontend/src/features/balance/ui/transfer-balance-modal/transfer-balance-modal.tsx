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
  close: () => void;
};

const TransferBalanceModal = ({ defaultAddress = '', close }: Props) => {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const balance = useDeriveBalancesAll(account?.address);

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

    const onSuccess = close;
    const onError = disableLoading;

    const extrinsic = keepAlive
      ? api.tx.balances.transferKeepAlive(address, value)
      : api.tx.balances.transferAllowDeath(address, value);

    signAndSend(extrinsic, 'Transfer', { onSuccess, onError });
  });

  return (
    <Modal heading="Transfer Balance" size="large" close={close}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputs}>
            <Input name={FIELD_NAME.ADDRESS} label="Address" direction="y" block />

            <div>
              <ValueField name={FIELD_NAME.VALUE} label="Value" direction="y" block />

              <div className={styles.balance}>
                <p className={styles.text}>Your transferrable balance:</p>
                <Balance value={balance?.availableBalance} />
              </div>
            </div>

            <Checkbox name={FIELD_NAME.KEEP_ALIVE} label="Keep Alive" />
          </div>

          <div className={styles.buttons}>
            <Button type="submit" icon={SubmitSVG} text="Send" size="large" disabled={isLoading} />
            <Button icon={CloseSVG} text="Close" size="large" color="light" onClick={close} />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export { TransferBalanceModal };
