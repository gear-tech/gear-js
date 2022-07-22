import clsx from 'clsx';
import { Loader } from 'react-feather';

import styles from './Spinner.module.scss';

type Props = {
  color?: string;
  absolute?: boolean;
};

const Spinner = ({ color = '#fff', absolute = false }: Props) => (
  <Loader color={color} data-testid="spinner" className={clsx(styles.loader, absolute && styles.absolute)} />
);

export { Spinner };
