import { Button } from '@gear-js/ui';
import { ReactNode } from 'react';
import back from 'assets/images/icons/back.svg';
import home from 'assets/images/icons/home.svg';
import styles from './Box.module.scss';

type Props = {
  onBack: () => void;
  onHome: () => void;
  isNavigationVisible: boolean;
  children: ReactNode;
};

function Box({ onBack, onHome, isNavigationVisible, children }: Props) {
  return (
    <div className={styles.box}>
      <header>
        {isNavigationVisible && (
          <div className={styles.buttons}>
            <Button icon={back} color="secondary" onClick={onBack} />
            <Button icon={home} color="secondary" onClick={onHome} />
          </div>
        )}
        <h2 className={styles.heading}>
          Escrow <span className={styles.contract}>contract</span>
        </h2>
      </header>
      <div className={styles.body}>{children}</div>
    </div>
  );
}

export { Box };
