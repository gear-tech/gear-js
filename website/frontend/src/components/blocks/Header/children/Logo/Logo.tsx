import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { ReactComponent as SVG } from './images/logo.svg';

const Logo = () => (
  <Link to={routes.main} className="img-wrapper">
    <SVG data-testid="svg" />
  </Link>
);

export { Logo };
