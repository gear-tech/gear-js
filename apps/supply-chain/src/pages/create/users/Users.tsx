import { Hex } from '@gear-js/api';
import clsx from 'clsx';
import { Box } from 'components';
import styles from './Users.module.scss';

type Props = {
  heading: string;
  list: Hex[];
};

function Users({ heading, list }: Props) {
  const usersAmount = list.length;
  const isAnyUser = usersAmount > 0;
  const amountClassName = clsx(isAnyUser && styles.amount);

  const getUsers = () =>
    list.map((user, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <li key={index} className={styles.user}>
        {user}
      </li>
    ));

  return (
    <div className={styles.users}>
      <p className={styles.heading}>
        {heading}: <span className={amountClassName}>{usersAmount}</span>
      </p>
      <Box secondary>
        <ul className={styles.list}>{getUsers()}</ul>
      </Box>
    </div>
  );
}

export { Users };
