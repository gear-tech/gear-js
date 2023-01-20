import { useState } from 'react';
import { isMobileDevice } from 'shared/helpers';

const useMobileDisclaimer = () => {
  const [isMobileDisclaimerVisible, setIsMobileDisclaimerVisible] = useState(isMobileDevice());

  const closeMobileDisclaimer = () => setIsMobileDisclaimerVisible(false);

  return { isMobileDisclaimerVisible, closeMobileDisclaimer };
};

export { useMobileDisclaimer };
