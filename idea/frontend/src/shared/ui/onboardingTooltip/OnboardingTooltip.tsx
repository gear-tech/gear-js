import { Button } from '@gear-js/ui';
import { ReactNode } from 'react';
import clsx from 'clsx';

import { useOnboarding } from 'hooks';
import { ReactComponent as ArrowSVG } from 'shared/assets/images/actions/arrowRight.svg';
import { ReactComponent as CrossSVG } from 'shared/assets/images/actions/close.svg';

import styles from './OnboardingTooltip.module.scss';

type Props = {
  children: ReactNode;
  index: number;
  className?: string;
};

const OnboardingTooltip = ({ children, index, className }: Props) => {
  const { step, lastStep, isFirstStep, isLastStep, nextStep, prevStep, heading, text, stepName } = useOnboarding();

  const counterText = `${step + 1} of ${lastStep + 1}`;

  const wrapperClassName = clsx(styles.wrapper, className);
  const tooltipClassName = clsx(styles.tooltip, styles[stepName]);

  const isVisible = index === step;

  return (
    <div className={wrapperClassName}>
      {children}

      {isVisible && (
        <div className={tooltipClassName}>
          <header className={styles.header}>
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

            <Button icon={CrossSVG} color="transparent" />
          </header>

          <div className={styles.main}>
            <h2 className={styles.heading}>{heading}</h2>
            <p className={styles.text}>{text}</p>
          </div>

          {!isLastStep && (
            <footer>
              <Button text="Next" color="secondary" onClick={nextStep} />
            </footer>
          )}
        </div>
      )}
    </div>
  );
};

export { OnboardingTooltip };
