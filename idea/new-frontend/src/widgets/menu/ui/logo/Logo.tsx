import { CSSTransition } from 'react-transition-group';

import { ReactComponent as GearsSVG } from 'shared/assets/images/gear/gears.svg';
import { ReactComponent as IdeaLogoSVG } from 'shared/assets/images/gear/idea.svg';
import { ReactComponent as GearLogoSVG } from 'shared/assets/images/gear/gearText.svg';

import styles from './Logo.module.scss';
import { ANIMATION_TIMEOUT } from '../../model/consts';

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
