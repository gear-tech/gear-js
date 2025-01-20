import { createContext } from 'react';

type Value = {
  stepIndex: number;
  step: string;
  lastStepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  heading: string;
  text: string;
  isOnboardingActive: boolean;
  prevStep: () => void;
  nextStep: () => void;
  stopOnboarding: () => void;
};

const OnboardingContext = createContext<Value>({} as Value);

export { OnboardingContext };
