import ExternalResourceSVG from '@/shared/assets/images/actions/externalResource.svg?react';
import AppSVG from '@/shared/assets/images/indicators/app.svg?react';
import { EXAMPLES_HREF, AnimationTimeout } from '@/shared/config';
import { CSSTransitionWithRef } from '@/shared/ui';

import styles from '../Menu.module.scss';

type Props = {
  isFullWidth: boolean;
};

const AppExamplesLink = ({ isFullWidth }: Props) => (
  <a rel="noreferrer" href={EXAMPLES_HREF} target="_blank" className={styles.navLink}>
    <span className={styles.icon}>
      <AppSVG />
    </span>

    <CSSTransitionWithRef in={isFullWidth} timeout={AnimationTimeout.Tiny}>
      <div className={styles.linkContent}>
        <span className={styles.linkText}>App Examples</span>
        <ExternalResourceSVG />
      </div>
    </CSSTransitionWithRef>
  </a>
);

export { AppExamplesLink };
