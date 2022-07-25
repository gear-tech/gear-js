import clsx from 'clsx';
import styles from './Header.module.scss';
import commonStyles from '../ExpansionPanel.module.scss';
import { BlockNumber } from './BlockNumber/BlockNumber';

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

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <header className={styles.header} onClick={onClick}>
      <div className={styles.main}>
        <span className={styles.caption}>{caption}</span>
        <span className={arrowClassName} />
        {counter && counter > 1 && <span className={styles.counter}>{counter}</span>}
        {blockNumber && <BlockNumber value={blockNumber} />}
      </div>
      <div className={commonStyles.text}>{description}</div>
    </header>
  );
};

export { Header };
