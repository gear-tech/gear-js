import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';

import { AnimationTimeout } from 'shared/config';
import { ReactComponent as ShareSVG } from 'shared/assets/images/indicators/share.svg';
import { ReactComponent as ShieldSVG } from 'shared/assets/images/indicators/shield.svg';
import { ReactComponent as LoadingSVG } from 'shared/assets/images/indicators/loading.svg';

import styles from './Info.module.scss';

type Props = {
  isAwait: boolean;
  reserved: string;
  returned: string;
};

const Info = ({ isAwait, reserved, returned }: Props) => (
  <CSSTransition in appear timeout={AnimationTimeout.Default}>
    <div className={styles.gasInfoCard}>
      {isAwait && (
        <p className={styles.info}>
          <ShareSVG />
          <span className={styles.text}>Added to waitlist...</span>
        </p>
      )}
      <p className={styles.info}>
        <ShieldSVG />
        <span className={styles.text}>Reserved:</span>
        <span className={clsx(styles.value, styles.green)}>{reserved}</span>
      </p>
      <p className={styles.info}>
        <LoadingSVG />
        <span className={styles.text}>Maybe returned:</span>
        <span className={clsx(styles.value, styles.blue)}>{returned}</span>
      </p>
    </div>
  </CSSTransition>
);

export { Info };
