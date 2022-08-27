// import styles from './Home.module.scss';
import { useAccount } from '@gear-js/react-hooks';

import { RecentPrograms } from './recentPrograms';

const Home = () => {
  const { account } = useAccount();

  return <RecentPrograms account={account} />;
};

export { Home };
