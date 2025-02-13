import { Link } from 'react-router-dom';
import { routes } from '@/shared/config';
import CodeSVG from '@/assets/icons/code.svg?react';
import MessageSVG from '@/assets/icons/message.svg?react';
import TransactionSVG from '@/assets/icons/arrange-square.svg?react';
import UserSVG from '@/assets/icons/user-square.svg?react';
import { formatNumber } from '@/shared/utils';
import styles from './home.module.scss';

const cards = [
  {
    title: 'Programs',
    icon: <CodeSVG />,
    action: 'View All',
    count: 100000,
    increase: 5000,
  },
  {
    title: 'Messages',
    icon: <MessageSVG />,
    count: 100000,
    increase: 5000,
  },
  {
    title: 'Transactions',
    icon: <TransactionSVG />,
    count: 100000,
    increase: 5000,
  },
  {
    title: 'Users',
    icon: <UserSVG />,
    count: 100000,
    increase: 5000,
  },
];

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.accent}>Idea Gear.exe</span>
        </h1>
      </div>
      <div className={styles.titleContainer}>
        <h2 className={styles.subtitle}>
          {'//_A portal for codes, programs, and events on Vara and Ethereum Networks, powered by Gear.exe'}
        </h2>
      </div>

      {cards.map(({ title, icon, action, count, increase }) => (
        <div className={styles.card} key={title}>
          <div className={styles.row}>
            <span className={styles.cardTitle}>
              {icon}
              {title}
            </span>
            {action && (
              <Link className={styles.link} to={routes.programs}>
                [{action}]
              </Link>
            )}
          </div>
          <div className={styles.row}>
            <span className={styles.cardCount}>{formatNumber(count)}</span>
            {increase && (
              <span>
                <span className={styles.accent}>+ {formatNumber(increase)}</span> / last 24h
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export { Home };
