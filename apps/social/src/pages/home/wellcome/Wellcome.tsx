import { OnLogin } from 'components';
import { useAccount } from '@gear-js/react-hooks';

import styles from './Wellcome.module.scss';

function Wellcome() {
  const { account } = useAccount();

  return (
    <header className={styles.header}>
      <h2 className={styles.heading}>Gear Feeds</h2>
      <OnLogin>
        <h3 className={styles.greeting}>
          Hello, <span>{account?.meta.name}</span>
        </h3>
      </OnLogin>
      <div className={styles.description}>
        Welcome to Gear workshop! You can find more information about Gear{' '}
        <a href="https://gear-tech.io" target="_blank" rel="noreferrer">
          here
        </a>
        .<br /> Follow the instructions to create your own channel.
      </div>
    </header>
  );
}
export { Wellcome };
