import { Link } from 'react-router-dom';

import { useNetworkIcon } from 'hooks';
import { routes } from 'shared/config';
import IdeaSVG from 'shared/assets/images/logos/idea.svg?react';

import styles from './Logo.module.scss';

type Props = {
  isOpen: boolean;
};

const Logo = ({ isOpen }: Props) => {
  const { SVG, ShortSVG } = useNetworkIcon();

  return (
    <Link to={routes.programs} className={styles.logoWrapper}>
      {isOpen && <IdeaSVG className={styles.ideaSVG} />}
      {!isOpen && <ShortSVG />}
      {isOpen && <SVG />}
    </Link>
  );
};

export { Logo };
