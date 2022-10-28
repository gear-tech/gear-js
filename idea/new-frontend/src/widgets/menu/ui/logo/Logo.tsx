import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';

import { AnimationTimeout, routes } from 'shared/config';
import { ReactComponent as GearsSVG } from 'shared/assets/images/logos/gears.svg';
import { ReactComponent as IdeaLogoSVG } from 'shared/assets/images/logos/idea.svg';
import { ReactComponent as GearLogoSVG } from 'shared/assets/images/logos/gearText.svg';

import styles from './Logo.module.scss';

type Props = {
  isOpen: boolean;
};

const Logo = ({ isOpen }: Props) => (
  <Link to={routes.programs} className={styles.logoWrapper}>
    <CSSTransition in={isOpen} timeout={AnimationTimeout.Default} unmountOnExit className={styles.ideaLogo}>
      <IdeaLogoSVG />
    </CSSTransition>
    <GearsSVG className={styles.gearsLogo} />
    <CSSTransition in={isOpen} timeout={AnimationTimeout.Default} unmountOnExit className={styles.gearLogo}>
      <GearLogoSVG />
    </CSSTransition>
  </Link>
);

export { Logo };
