import { useAccount } from '@gear-js/react-hooks';

import styles from './Welcome.module.scss';

function Welcome() {
    const { account } = useAccount();

    return (
        <header className={styles.header}>
            <h2 className={styles.heading}>Gear Feeds</h2>
            <h3 className={styles.greeting}>
                Hello, <span>{account?.meta.name}</span>
            </h3>
            <div className={styles.description}>
                Welcome to Gear workshop! You can find more information about Gear{' '}
                <a href="https://gear-tech.io" target="_blank" rel="noreferrer">
                    here
                </a>
                .<p> Follow the instructions to create your own channel.</p>
            </div>
        </header>
    );
}
export { Welcome };
