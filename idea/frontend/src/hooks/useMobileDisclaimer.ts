import { useState } from 'react';
import { LocalStorage } from 'shared/config';
import { isMobileDevice } from 'shared/helpers';

const useMobileDisclaimer = () => {
  const [isMobileDisclaimerVisible, setIsMobileDisclaimerVisible] = useState(
    isMobileDevice() && !localStorage[LocalStorage.IsNewUser],
  );

  const closeMobileDisclaimer = () => {
    setIsMobileDisclaimerVisible(false);
    localStorage.setItem(LocalStorage.IsNewUser, 'false');
  };

  return { isMobileDisclaimerVisible, closeMobileDisclaimer };
};

export { useMobileDisclaimer };
