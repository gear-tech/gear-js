import { ReactComponent as VaraSVG } from 'shared/assets/images/logos/vara.svg';
import { ReactComponent as ShortVaraSVG } from 'shared/assets/images/logos/shortcut/vara.svg';

const DEVELOPMENT_SECTION = 'development';

const GENESIS = {
  VARA: '0x69599490fc00e8c5636ec255f4eee61d1ca950dd87df7a32cd92b6c8f61dbe28',
};

const LOGO = {
  [GENESIS.VARA]: { SVG: VaraSVG, SHORT_SVG: ShortVaraSVG },
};

export { DEVELOPMENT_SECTION, LOGO };
