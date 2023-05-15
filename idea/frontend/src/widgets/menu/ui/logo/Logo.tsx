import { useApi } from '@gear-js/react-hooks';
import { Link } from 'react-router-dom';

import { routes } from 'shared/config';
import { ReactComponent as IdeaSVG } from 'shared/assets/images/logos/idea.svg';
import { ReactComponent as GearSVG } from 'shared/assets/images/logos/gear.svg';
import { ReactComponent as ShortGearSVG } from 'shared/assets/images/logos/shortcut/gear.svg';

import { LOGO } from '../../model/consts';
import styles from './Logo.module.scss';

type Props = {
  isOpen: boolean;
};

const Logo = ({ isOpen }: Props) => {
  const { api, isApiReady } = useApi();

  const genesis = isApiReady ? api.genesisHash.toHex() : undefined;

  const logo = genesis ? LOGO[genesis] : undefined;
  const SVG = logo?.SVG || GearSVG;
  const ShortSVG = logo?.SHORT_SVG || ShortGearSVG;

  return (
    <Link to={routes.programs} className={styles.logoWrapper}>
      {isOpen && <IdeaSVG className={styles.ideaSVG} />}
      {!isOpen && <ShortSVG />}
      {isOpen && <SVG />}
    </Link>
  );
};

export { Logo };
