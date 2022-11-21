import { ProviderProps } from '@gear-js/react-hooks';
import { useState } from 'react';

import { OnboardingContext } from './Context';

const { Provider } = OnboardingContext;

const OnboardingProvider = ({ children }: ProviderProps) => {
  const [step, setStep] = useState(0);

  return <Provider value={{ step }}>{children}</Provider>;
};

export { OnboardingProvider };
