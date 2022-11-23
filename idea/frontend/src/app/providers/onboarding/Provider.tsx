import { ProviderProps, useAccount } from '@gear-js/react-hooks';
import { useState, useEffect } from 'react';
import { LocalStorage } from 'shared/config';

import { OnboardingContext } from './Context';
import { getHeading, getText } from './helpers';

const steps = ['wallet', 'program', 'code', 'codes', 'message', 'messages', 'explorer', 'mailbox', 'apps', 'node'];

const { Provider } = OnboardingContext;

const OnboardingProvider = ({ children }: ProviderProps) => {
  const { account } = useAccount();

  const accountAddress = account?.address;

  const [isOnboardingActive, setIsOnboardingActive] = useState(!localStorage[LocalStorage.IsNewUser]);
  const [stepIndex, setStepIndex] = useState(0);

  const step = steps[stepIndex];
  const lastStepIndex = steps.length - 1;
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === lastStepIndex;
  const heading = getHeading(stepIndex);
  const text = getText(stepIndex);

  const prevStep = () => setStepIndex((prevIndex) => prevIndex - 1);
  const nextStep = () => setStepIndex((prevIndex) => prevIndex + 1);

  const stopOnboarding = () => {
    setIsOnboardingActive(false);
    localStorage.setItem(LocalStorage.IsNewUser, 'false');
  };

  useEffect(() => {
    if (accountAddress) setStepIndex(1);
  }, [accountAddress]);

  const value = {
    stepIndex,
    step,
    lastStepIndex,
    isFirstStep,
    isLastStep,
    heading,
    text,
    isOnboardingActive,
    prevStep,
    nextStep,
    stopOnboarding,
  };

  return <Provider value={value}>{children}</Provider>;
};

export { OnboardingProvider };
