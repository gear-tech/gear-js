// import styles from './Home.module.scss';
import { useAccount } from '@gear-js/react-hooks';

import { RecentPrograms } from './recentPrograms';

const Home = () => {
  const { account } = useAccount();

  const isLoggedIn = Boolean(account);

  return <RecentPrograms isLoggedIn={isLoggedIn} />;
};

export { Home };
