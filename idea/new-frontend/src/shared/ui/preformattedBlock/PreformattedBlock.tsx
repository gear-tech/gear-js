import clsx from 'clsx';

import styles from './PreformattedBlock.module.scss';

type Props = {
  text: string;
  className?: string;
};

const PreformattedBlock = ({ text, className }: Props) => (
  <pre className={clsx(styles.preformattedBlock, className)}>{text}</pre>
);

export { PreformattedBlock };
