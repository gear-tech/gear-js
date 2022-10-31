import { Hex } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

import { isHexValid } from 'shared/helpers';

import styles from './Header.module.scss';

type Props = {
  onSearchSubmit: (query: Hex) => void;
};

const initialValues = { query: '' as Hex };
const validate = { query: isHexValid };
const initForm = { initialValues, validate };

const Header = ({ onSearchSubmit }: Props) => {
  const { account } = useAccount();
  const { address } = account || {};

  const { getInputProps, onSubmit, reset } = useForm(initForm);

  const handleSubmit = onSubmit(({ query }) => onSearchSubmit(query));

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <header className={styles.header}>
      <h2 className={styles.heading}>Mailbox</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input type="search" placeholder="Search by ID" {...getInputProps('query')} />
      </form>
    </header>
  );
};

export { Header };
