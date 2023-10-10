import { Button } from '@gear-js/ui';
import { useAccount } from '@gear-js/react-hooks';
import { ReactNode } from 'react';
import clsx from 'clsx';

import { useOnboarding } from '@/hooks';
import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';
import CrossSVG from '@/shared/assets/images/actions/close.svg?react';

import styles from './OnboardingTooltip.module.scss';

type Props = {
  children: ReactNode;
  index: number;
  className?: string;
};

const OnboardingTooltip = ({ children, index, className }: Props) => {
  const { account } = useAccount();
  const {
    stepIndex,
    step,
    lastStepIndex,
    isFirstStep,
    isLastStep,
    heading,
    text,
    isOnboardingActive,
    nextStep,
    prevStep,
    stopOnboarding,
  } = useOnboarding();

  const counterText = `${stepIndex + 1} of ${lastStepIndex + 1}`;

  const isVisible = index === stepIndex && isOnboardingActive;
  const isFirstStepLocked = isFirstStep && !account;

  const wrapperClassName = clsx(styles.wrapper, className, isVisible && styles.active, styles[step]);
  const tooltipClassName = clsx(styles.tooltip, styles[step]);

  return (
    <div className={wrapperClassName}>
      {children}

      {isVisible && (
        <>
          <div className={tooltipClassName}>
            <header className={styles.header}>
              {!isFirstStepLocked && (
                <div className={styles.steps}>
                  <Button
                    icon={ArrowSVG}
                    color="transparent"
                    className={styles.prevStepButton}
                    onClick={prevStep}
                    disabled={isFirstStep}
                  />
                  <p>{counterText}</p>
                  <Button icon={ArrowSVG} color="transparent" onClick={nextStep} disabled={isLastStep} />
                </div>
              )}

              <Button icon={CrossSVG} color="transparent" className={styles.closeButton} onClick={stopOnboarding} />
            </header>

            <div className={styles.main}>
              <h2 className={styles.heading}>{heading}</h2>
              <p className={styles.text}>{text}</p>
            </div>

            {!isFirstStepLocked && !isLastStep && (
              <footer>
                <Button text="Next" color="secondary" onClick={nextStep} />
              </footer>
            )}
          </div>
          <div className={styles.overlay} />
        </>
      )}
    </div>
  );
};

export { OnboardingTooltip };
