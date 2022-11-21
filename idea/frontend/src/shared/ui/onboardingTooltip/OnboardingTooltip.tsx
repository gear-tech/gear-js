import { Button } from '@gear-js/ui';

import { ReactComponent as ArrowSVG } from 'shared/assets/images/actions/arrowRight.svg';
import { ReactComponent as CrossSVG } from 'shared/assets/images/actions/close.svg';

import styles from './OnboardingTooltip.module.scss';

const OnboardingTooltip = () => {
  console.log();

  return (
    <div className={styles.tooltip}>
      <header className={styles.header}>
        <div className={styles.steps}>
          <Button icon={ArrowSVG} color="transparent" className={styles.prevStepButton} />
          <p>1 of 10</p>
          <Button icon={ArrowSVG} color="transparent" />
        </div>

        <Button icon={CrossSVG} color="transparent" />
      </header>

      <div className={styles.main}>
        <h2 className={styles.heading}>Connect your account to start working with the portal</h2>
        <p className={styles.text}>Click here to select a wallet and choose an account</p>
      </div>

      <footer>
        <Button text="Next" color="secondary" />
      </footer>
    </div>
  );
};

export { OnboardingTooltip };
