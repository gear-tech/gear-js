import { isHex } from '@polkadot/util';
import { Outlet, useNavigate } from 'react-router-dom';

import { SearchForm } from '@/shared/ui';
import { isNumeric } from '@/shared/helpers';

import styles from './explorer.module.scss';

const Explorer = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.explorer}>
      <h2 className={styles.heading}>Recent events</h2>

      <SearchForm
        placeholder="Search block hash or number to query"
        onSubmit={(block) => navigate(`/explorer/${block}`)}
        getSchema={(schema) =>
          schema.refine((value) => isNumeric(value) || isHex(value), 'Value should be number or hex')
        }
      />

      <Outlet />
    </section>
  );
};

export { Explorer };
