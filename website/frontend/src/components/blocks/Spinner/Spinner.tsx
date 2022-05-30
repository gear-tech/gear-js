import clsx from 'clsx';
import { Loader } from 'react-feather';

import styles from './Spinner.module.scss';

type Props = {
  over?: boolean;
  color?: string;
};

const Spinner = ({ color = '#fff', over = true }: Props) => (
  <Loader color={color} className={clsx(styles.loader, over && styles.over)} />
);

export { Spinner };
