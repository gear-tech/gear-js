import styles from './HeaderItem.module.scss';
import { HeaderCol } from '../../types';

const HeaderItem = ({ icon, text }: HeaderCol) => (
  <div className={styles.headerItem}>
    <img className={styles.icon} src={icon} alt={text} />
    <span className={styles.text}>{text}</span>
  </div>
);

export { HeaderItem };
