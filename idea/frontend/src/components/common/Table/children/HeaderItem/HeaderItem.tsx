import clsx from 'clsx';

import styles from './HeaderItem.module.scss';
import { HeaderCol } from '../../types';

const HeaderItem = ({ icon, text, align = 'left' }: HeaderCol) => (
  <div className={clsx(styles.headerItem, styles[align])}>
    <img className={styles.icon} src={icon} alt={text} />
    <span className={styles.text}>{text}</span>
  </div>
);

export { HeaderItem };
