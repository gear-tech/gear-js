import { Link } from 'react-router-dom';
import styles from './BlockNumber.module.scss';

type Props = {
  value: string;
};

const BlockNumber = ({ value }: Props) => {
  const number = value.split(',').join('');
  const path = `/explorer/${number}`;

  return (
    <Link to={path} className={styles.number}>
      {value}
    </Link>
  );
};

export { BlockNumber };
