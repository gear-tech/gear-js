import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import clsx from 'clsx';
import trash from 'assets/images/icons/trash.svg';
import { Box } from 'components';
import styles from './Users.module.scss';

type Props = {
  heading: string;
  list: Hex[];
  onRemoveButtonClick: (id: number) => void;
};

function Users({ heading, list, onRemoveButtonClick }: Props) {
  const usersAmount = list.length;
  const isAnyUser = usersAmount > 0;
  const amountClassName = clsx(isAnyUser && styles.amount);

  const getUsers = () =>
    list.map((user, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <li key={index} className={styles.user}>
        {user}
        <Button icon={trash} color="secondary" className={styles.button} onClick={() => onRemoveButtonClick(index)} />
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
