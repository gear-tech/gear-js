import { ReactNode, useState } from 'react';
import clsx from 'clsx';
import { Header } from './Header/Header';
import styles from './ExpansionPanel.module.scss';

type Props = {
  caption: string;
  description: string;
  blockNumber?: string;
  counter?: number;
  className?: string;
  children: ReactNode;
};

const ExpansionPanel = ({ caption, description, blockNumber, counter, className, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  return (
    <div className={clsx(styles.item, className)}>
      <Header
        caption={caption}
        description={description}
        blockNumber={blockNumber}
        counter={counter}
        isOpen={isOpen}
        onClick={toggle}
      />
      {isOpen && <div className={styles.body}>{children}</div>}
    </div>
  );
};

export { ExpansionPanel };
