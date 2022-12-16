import { Button } from '@gear-js/ui';
import { useAccount } from '@gear-js/react-hooks';
import { ReactNode } from 'react';
import { ReactComponent as back } from 'assets/images/icons/back.svg';
import { ReactComponent as home } from 'assets/images/icons/home.svg';
import { InfoText } from '../../info-text';
import styles from './Box.module.scss';

type Props = {
  onBack: () => void;
  onHome: () => void;
  isNavigationVisible: boolean;
  children: ReactNode;
};

function Box({ onBack, onHome, isNavigationVisible, children }: Props) {
  const { account } = useAccount();

  return (
    <div className={styles.box}>
      <header>
        {isNavigationVisible && (
          <div className={styles.buttons}>
            <Button icon={back} color='transparent' onClick={onBack} />
            <Button icon={home} color='transparent' onClick={onHome} />
          </div>
        )}
        <h2 className={styles.heading}>
          Escrow <span className={styles.contract}>contract</span>
        </h2>
      </header>
      <div className={styles.body}>{account ? children : <InfoText text='In order to use app, please login.' />}</div>
    </div>
  );
}

export { Box };
