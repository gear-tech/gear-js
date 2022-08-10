import { Link } from 'react-router-dom';
import clsx from 'clsx';

import styles from './Header.module.scss';
import commonStyles from '../../ExpansionPanel.module.scss';

type Props = {
  caption: string;
  description: string;
  blockNumber?: string;
  counter?: number;
  isOpen: boolean;
  onClick: () => void;
};

const Header = ({ caption, description, blockNumber, counter, isOpen, onClick }: Props) => {
  const arrowClassName = clsx(styles.arrow, isOpen ? styles.up : styles.down);

  const number = blockNumber?.split(',').join('');

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <header className={styles.header} onClick={onClick}>
      <div className={styles.main}>
        <span className={styles.caption}>{caption}</span>
        <span className={arrowClassName} />
        {counter && counter > 1 && <span className={styles.counter}>{counter}</span>}
        {blockNumber && (
          <Link to={`/explorer/${number}`} className={styles.number}>
            {blockNumber}
          </Link>
        )}
      </div>
      <div className={commonStyles.text}>{description}</div>
    </header>
  );
};

export { Header };
