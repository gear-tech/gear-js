import { useAccount } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { LocalStorage } from '@/shared/config';

import { ProgramsPage } from './programsPage';
import { WelcomeBanner } from './welcomeBanner';

const Programs = () => {
  const { account } = useAccount();
  const isLoggedIn = !!account;

  const initIsBannerVisible = !(isLoggedIn || Boolean(localStorage.getItem(LocalStorage.HideWelcomeBanner)));
  const [isBannerVisible, setIsBannerVisible] = useState(initIsBannerVisible);

  const closeBanner = () => {
    setIsBannerVisible(false);
    localStorage.setItem(LocalStorage.HideWelcomeBanner, 'true');
  };

  useEffect(() => {
    setIsBannerVisible(initIsBannerVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <>
      {isBannerVisible && <WelcomeBanner onClose={closeBanner} />}
      <ProgramsPage />
    </>
  );
};

export { Programs };
