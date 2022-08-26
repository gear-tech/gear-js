import { CSSTransition } from 'react-transition-group';

import { ANIMATION_TIMEOUT } from 'shared/config';
import { ReactComponent as GearsSVG } from 'shared/assets/images/logos/gears.svg';
import { ReactComponent as IdeaLogoSVG } from 'shared/assets/images/logos/idea.svg';
import { ReactComponent as GearLogoSVG } from 'shared/assets/images/logos/gearText.svg';

import styles from './Logo.module.scss';

type Props = {
  isOpen: boolean;
};

const Logo = ({ isOpen }: Props) => (
  <div className={styles.logoWrapper}>
    <CSSTransition in={isOpen} timeout={ANIMATION_TIMEOUT} unmountOnExit className={styles.ideaLogo}>
      <IdeaLogoSVG />
    </CSSTransition>
    <GearsSVG className={styles.gearsLogo} />
    <CSSTransition in={isOpen} timeout={ANIMATION_TIMEOUT} unmountOnExit className={styles.gearLogo}>
      <GearLogoSVG />
    </CSSTransition>
  </div>
);

export { Logo };
