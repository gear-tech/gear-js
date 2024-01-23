import { useAccount } from '@gear-js/react-hooks';
import { Input } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { isHexValid } from '@/shared/helpers';

import styles from './Header.module.scss';

type Props = {
  onSearchSubmit: (query: HexString) => void;
};

const defaultValues = { query: '' as HexString };
const validate = isHexValid;

const Header = ({ onSearchSubmit }: Props) => {
  const { account } = useAccount();
  const { address } = account || {};

  const form = useForm({ defaultValues });
  const { register, reset, getFieldState, formState } = form;
  const { error } = getFieldState('query', formState);

  const handleSubmit = ({ query }: typeof defaultValues) => onSearchSubmit(query);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <header className={styles.header}>
      <h2 className={styles.heading}>Mailbox</h2>

      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        <Input type="search" placeholder="Search by ID" error={error?.message} {...register('query', { validate })} />
      </form>
    </header>
  );
};

export { Header };
