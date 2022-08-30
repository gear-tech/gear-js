import { useAccount } from '@gear-js/react-hooks';

import { GearSection } from './gearSection';
import { RecentProgramsSection } from './recentProgramsSection';

const Home = () => {
  const { account } = useAccount();

  return (
    <>
      <GearSection isLoggedIn={Boolean(account)} />
      <RecentProgramsSection account={account} />
    </>
  );
};

export { Home };
